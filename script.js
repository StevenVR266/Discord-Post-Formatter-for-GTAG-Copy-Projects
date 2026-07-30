'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post-form');
  const clearBtn = document.getElementById('btn-clear');
  const a11yStatus = document.getElementById('a11y-status');

  const inputs = {
    type: document.getElementById('input-type'),
    name: document.getElementById('input-name'),
    features: document.getElementById('input-features'),
    download: document.getElementById('input-download'),
    virustotal: document.getElementById('input-virustotal'),
    credits: document.getElementById('input-credits'),
    image: document.getElementById('input-image')
  };

  const outputs = {
    title: document.getElementById('output-title'),
    content: document.getElementById('output-content')
  };

  const formatFeatures = (rawFeatures) => {
    if (!rawFeatures.trim()) {
      return '> • No features listed';
    }

    return rawFeatures
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `> • ${line.replace(/^[-*•\s]+/, '')}`)
      .join('\n');
  };

  const generatePost = () => {
    const prefix = inputs.type.value;
    const name = inputs.name.value.trim() || 'Resource Name';
    const featuresFormatted = formatFeatures(inputs.features.value);
    const download = inputs.download.value.trim() || 'No link provided';
    const virustotal = inputs.virustotal.value.trim();
    const credits = inputs.credits.value.trim();
    const image = inputs.image.value.trim();

    // Outputs exact Thread Title: "📌 Mountain Beta"
    outputs.title.value = `${prefix}${name}`;

    const postLines = [
      `> ─────────────`,
      `> 📌 **${name}**`,
      `> `,
      `> 📝 **Contents / Features:**`,
      featuresFormatted,
      `> `,
      `> 📥 **Download:** ${download}`
    ];

    if (virustotal) {
      postLines.push(`> 🛡️ **VirusTotal:** ${virustotal}`);
    }

    if (credits) {
      postLines.push(`> 👤 **Credits:** ${credits}`);
    }

    postLines.push(`> ─────────────`, `> _Please give credit if you use this project!_`);

    let finalContent = postLines.join('\n');
    if (image) {
      finalContent += `\n\n${image}`;
    }

    outputs.content.value = finalContent;
  };

  const handleCopy = async (button) => {
    const targetId = button.getAttribute('data-copy-target');
    const targetInput = document.getElementById(targetId);

    if (!targetInput || !targetInput.value) return;

    const textToCopy = targetInput.value;
    const originalText = button.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        targetInput.select();
        document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
      }

      button.textContent = '✅ Copied!';
      button.classList.add('btn--success');
      
      if (a11yStatus) {
        a11yStatus.textContent = `${button.previousElementSibling?.textContent || 'Content'} copied to clipboard.`;
      }

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn--success');
        if (a11yStatus) a11yStatus.textContent = '';
      }, 2000);

    } catch (error) {
      console.error('Failed to copy text: ', error);
      button.textContent = '❌ Copy Failed';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  const handleClear = () => {
    form.reset();
    generatePost();
    inputs.name.focus();
    if (a11yStatus) {
      a11yStatus.textContent = 'Form reset successfully.';
    }
  };

  form.addEventListener('input', generatePost);
  form.addEventListener('change', generatePost);
  clearBtn.addEventListener('click', handleClear);

  document.addEventListener('click', (event) => {
    const copyBtn = event.target.closest('[data-copy-target]');
    if (copyBtn) {
      handleCopy(copyBtn);
    }
  });

  generatePost();
});
