(function () {
  const API_URL = 'https://browser-analytics-eta.vercel.app/api/feedback'; 
  let html2canvasLoaded = false;

  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const projectId = scriptTag ? scriptTag.getAttribute('data-project-id') : null;

  if (!projectId) {
    console.error('FeedLoop Widget: Missing data-project-id attribute.');
    return;
  }

  const loadHtml2Canvas = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => { html2canvasLoaded = true; };
    document.head.appendChild(script);
  };
  loadHtml2Canvas();

  // 1. UPDATED CSS: Added styles for the dropdown and emoji buttons
  const injectCSS = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      #feedloop-widget-container {
        position: fixed; bottom: 24px; right: 24px; z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif;
      }
      #feedloop-trigger {
        width: 50px; height: 50px; border-radius: 25px;
        background-color: #141413; color: #FCFBFA;
        border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s;
      }
      #feedloop-trigger:hover { transform: scale(1.05); }
      #feedloop-modal {
        display: none; position: absolute; bottom: 70px; right: 0;
        width: 320px; background: #FCFBFA; border: 1.5px solid #141413;
        border-radius: 20px; padding: 20px; box-shadow: 0 12px 48px rgba(0,0,0,0.1);
      }
      #feedloop-modal.fl-open { display: block; }
      .fl-header { font-size: 14px; font-weight: 600; color: #141413; margin-bottom: 16px; }
      
      /* NEW CSS: The Row, Select, and Emojis */
      .fl-controls { display: flex; gap: 8px; margin-bottom: 12px; }
      .fl-select {
        flex: 1; padding: 8px 12px; border: 1.5px solid #e0e0e0; border-radius: 10px;
        font-size: 13px; background: #ffffff; color: #141413; cursor: pointer; outline: none;
      }
      .fl-select:focus { border-color: #141413; }
      .fl-emotions { display: flex; gap: 4px; background: #F3F0EE; padding: 4px; border-radius: 10px; }
      .fl-emo {
        background: transparent; border: none; cursor: pointer; font-size: 16px;
        padding: 4px 8px; border-radius: 6px; transition: background 0.2s;
      }
      .fl-emo:hover { background: #e0e0e0; }
      .fl-emo.active { background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

      .fl-textarea {
        width: 100%; height: 80px; border: 1.5px solid #e0e0e0; border-radius: 12px;
        padding: 12px; font-size: 13px; resize: none; margin-bottom: 12px;
        box-sizing: border-box; outline: none; background: #ffffff;
      }
      .fl-textarea:focus { border-color: #141413; }
      .fl-submit {
        width: 100%; background: #141413; color: #FCFBFA; border: none;
        padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 500;
        cursor: pointer; transition: opacity 0.2s;
      }
      .fl-submit:hover { opacity: 0.8; }
      .fl-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      .fl-footer { font-size: 10px; color: #696969; text-align: center; margin-top: 12px; }
    `;
    document.head.appendChild(style);
  };

  // 2. UPDATED HTML: Added the category dropdown and emotion buttons
  const createUI = () => {
    const container = document.createElement('div');
    container.id = 'feedloop-widget-container';

    container.innerHTML = `
      <div id="feedloop-modal">
        <div class="fl-header">Share your context</div>
        
        <div class="fl-controls">
          <select id="fl-category" class="fl-select">
            <option value="General">General Feedback</option>
            <option value="Bug">Report a Bug</option>
            <option value="Idea">Feature Request</option>
            <option value="Praise">Praise</option>
          </select>
          <div class="fl-emotions">
            <button class="fl-emo" data-emo="bug">🐛</button>
            <button class="fl-emo active" data-emo="thinking">🤔</button>
            <button class="fl-emo" data-emo="love">😍</button>
          </div>
        </div>

        <textarea id="fl-message" class="fl-textarea" placeholder="What's happening?"></textarea>
        <button id="fl-submit-btn" class="fl-submit">Send Feedback & Screen</button>
        <div class="fl-footer">Powered by FeedLoop</div>
      </div>
      <button id="feedloop-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    `;
    document.body.appendChild(container);
    return container;
  };

  // 3. UPDATED LOGIC: Capture the chosen emotion and category
  const initLogic = () => {
    const trigger = document.getElementById('feedloop-trigger');
    const modal = document.getElementById('feedloop-modal');
    const submitBtn = document.getElementById('fl-submit-btn');
    const messageInput = document.getElementById('fl-message');
    const categorySelect = document.getElementById('fl-category');
    const emoBtns = document.querySelectorAll('.fl-emo');

    // Track the selected emotion (defaults to thinking)
    let currentEmotion = 'thinking';

    // Emotion button logic
    emoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        emoBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentEmotion = e.currentTarget.getAttribute('data-emo');
      });
    });

    trigger.addEventListener('click', () => {
      modal.classList.toggle('fl-open');
    });

    submitBtn.addEventListener('click', async () => {
      const message = messageInput.value.trim();
      if (!message) return;

      submitBtn.textContent = 'Capturing screen...';
      submitBtn.disabled = true;

      let base64Image = null;

      if (html2canvasLoaded && window.html2canvas) {
        try {
          document.getElementById('feedloop-widget-container').style.display = 'none';
          const canvas = await window.html2canvas(document.body, { useCORS: true, scale: 1 });
          base64Image = canvas.toDataURL('image/jpeg', 0.5);
          document.getElementById('feedloop-widget-container').style.display = 'block';
        } catch (e) {
          console.warn("FeedLoop: Screen capture failed", e);
          document.getElementById('feedloop-widget-container').style.display = 'block';
        }
      }

      submitBtn.textContent = 'Sending...';

      // NEW: Send the dynamically selected values!
      const payload = {
        projectId: projectId,
        emotion: currentEmotion,
        category: categorySelect.value,
        message: message,
        url: window.location.href,
        browser_metadata: {
          userAgent: navigator.userAgent,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          language: navigator.language
        },
        screenshot: base64Image
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          submitBtn.textContent = 'Sent!';
          setTimeout(() => {
            modal.classList.remove('fl-open');
            messageInput.value = '';
            // Reset to defaults
            categorySelect.value = 'General';
            emoBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.fl-emo[data-emo="thinking"]').classList.add('active');
            currentEmotion = 'thinking';
            
            submitBtn.textContent = 'Send Feedback & Screen';
            submitBtn.disabled = false;
          }, 2000);
        } else {
          throw new Error('API rejected payload');
        }
      } catch (error) {
        console.error('FeedLoop Error:', error);
        submitBtn.textContent = 'Failed. Try again.';
        submitBtn.disabled = false;
      }
    });
  };

  const mountWidget = () => {
    injectCSS();
    createUI();
    initLogic();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();