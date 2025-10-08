const fullNameInput = document.getElementById('fullName');
const birthDateInput = document.getElementById('birthDate');
const cityInput = document.getElementById('city');
const contactsInput = document.getElementById('contacts');
const promptTypeSelect = document.getElementById('promptType');
const experienceInput = document.getElementById('experience');
const relocationCheckbox = document.getElementById('relocation');
const salaryInput = document.getElementById('salary');
const educationSelect = document.getElementById('education');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const statusEl = document.getElementById('status');

let currentRequestId = null;

// Load prompts on page load
async function loadPrompts() {
  try {
    const res = await fetch('/api/prompts');
    const data = await res.json();
    
    // Clear existing options except the first one
    promptTypeSelect.innerHTML = '<option value="">Выберите тип промпта...</option>';
    
    // Add prompt options
    data.prompts.forEach(prompt => {
      const option = document.createElement('option');
      option.value = prompt.id;
      option.textContent = prompt.name;
      promptTypeSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load prompts:', err);
    statusEl.textContent = 'Ошибка загрузки промптов';
  }
}

// Load prompts when page loads
loadPrompts();

// Date input mask
birthDateInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, ''); // Убираем все не-цифры
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '.' + value.substring(2);
  }
  if (value.length >= 5) {
    value = value.substring(0, 5) + '.' + value.substring(5);
  }
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  
  e.target.value = value;
});

// Prevent non-numeric input
birthDateInput.addEventListener('keypress', function(e) {
  // Разрешаем только цифры, backspace, delete, tab, escape, enter
  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
    e.preventDefault();
  }
});

function setLoading(isLoading) {
  if (isLoading) {
    statusEl.textContent = 'Generating your resume…';
    statusEl.className = 'status loading';
    generateBtn.disabled = true;
    downloadBtn.disabled = true;
  } else {
    generateBtn.disabled = false;
    statusEl.className = 'status';
  }
}

generateBtn.addEventListener('click', async () => {
  // Проверяем валидность формы
  const form = document.querySelector('.card');
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.boxShadow = '0 0 0 2px #ef4444';
      isValid = false;
    } else {
      input.style.boxShadow = '';
    }
  });
  
  if (!isValid) {
    statusEl.textContent = 'Заполните все обязательные поля';
    statusEl.className = 'status error';
    return;
  }

  const payload = {
    fullName: fullNameInput.value.trim(),
    birthDate: birthDateInput.value.trim(),
    city: cityInput.value.trim(),
    contacts: contactsInput.value.trim(),
    promptType: promptTypeSelect.value,
    experienceText: experienceInput.value.trim(),
    relocation: relocationCheckbox.checked,
    salary: salaryInput.value ? parseInt(salaryInput.value) : null,
    education: educationSelect.value,
  };

  setLoading(true);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    
    const data = await res.json();
    currentRequestId = data.requestId;
    
    if (data.status === 'ready') {
      statusEl.textContent = 'Готово. Можешь скачать PDF.';
      statusEl.className = 'status success';
      downloadBtn.disabled = false;
    } else {
      statusEl.textContent = 'Генерация завершена, но PDF не готов. Попробуй скачать.';
      statusEl.className = 'status success';
      downloadBtn.disabled = false;
    }
  } catch (e) {
    statusEl.textContent = 'Ошибка генерации: ' + e.message;
    statusEl.className = 'status error';
  } finally {
    setLoading(false);
  }
});

downloadBtn.addEventListener('click', async () => {
  if (!currentRequestId) {
    statusEl.textContent = 'Нет requestId для скачивания';
    return;
  }
  
  console.log('Downloading with requestId:', currentRequestId);
  const a = document.createElement('a');
  a.href = `/api/download?requestId=${encodeURIComponent(currentRequestId)}`;
  a.click();
});


