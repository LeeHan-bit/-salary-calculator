// DOM 요소들 가져오기
const hourInput = document.getElementById('hour');
const moneyInput = document.getElementById('money');
const taxInput = document.getElementById('tax');
const titleInput = document.getElementById('title');
const calculateBtn = document.getElementById('caLc');
const saveBtn = document.getElementById('saVe');
const resetBtn = document.getElementById('reSet');
const resultDiv = document.getElementById('result');
const savedResultsDiv = document.getElementById('saved-results');

// 소수점 허용 함수
function allowDecimalInput(event) {
  const value = event.target.value.replace(/[^0-9.]/g, '');
  const decimalCount = (value.match(/\./g) || []).length;
  event.target.value = decimalCount > 1 ? value.substring(0, value.lastIndexOf('.')) : value;
}

// 세금 입력에 소수점 허용
taxInput.addEventListener('input', allowDecimalInput);

//계산 함수
function calculateSalary() {
  const hour = parseFloat(hourInput.value);
  const money = parseFloat(moneyInput.value);
  const taxRate = parseFloat(taxInput.value) || 0;

  if (isNaN(hour) || isNaN(money)) {
    resultDiv.textContent = "모든 값을 정확히 입력해 주세요.";
    return;
  }

  const totalSalary = hour * money;
  const taxAmount = totalSalary * (taxRate / 100);
  const netSalary = totalSalary - taxAmount;

  resultDiv.innerHTML = `
    <div>총 급여: ${totalSalary.toLocaleString()}원</div>
    <div>세금: ${taxAmount.toLocaleString()}원</div>
    <div style="color: red;">실수령액: ${netSalary.toLocaleString()}원</div>
  `;
  resultDiv.style.display = 'block';
}

// 초기화 함수
function resetFields() {
  [hourInput, moneyInput, taxInput, titleInput].forEach(input => input.value = '');
  resultDiv.textContent = '';
  resultDiv.style.display = 'none';
}

function saveData() {
  const hour = parseFloat(hourInput.value);
  const money = parseFloat(moneyInput.value);
  const taxRate = parseFloat(taxInput.value) || 0;
  const title = titleInput.value.trim();

  if (isNaN(hour) || isNaN(money) || !title) {
    alert("올바른 데이터를 입력해 주세요.");
    return;
  }

  const totalSalary = hour * money;
  const taxAmount = totalSalary * (taxRate / 100);
  const netSalary = totalSalary - taxAmount;

  if (isNaN(totalSalary) || isNaN(taxAmount) || isNaN(netSalary)) {
    console.error("잘못된 계산 결과:", { totalSalary, taxAmount, netSalary });
    return;
  }

  const salaryData = {
    title,
    hour,           // 숫자로 저장
    money,          // 숫자로 저장
    taxRate,        // 숫자로 저장
    totalSalary,
    taxAmount,
    netSalary,
  };

  const savedData = JSON.parse(localStorage.getItem('savedSalaries')) || [];
  savedData.push(salaryData);
  localStorage.setItem('savedSalaries', JSON.stringify(savedData));

  displaySavedResults();
}

function displaySavedResults() {
  const savedData = JSON.parse(localStorage.getItem('savedSalaries')) || [];


  savedResultsDiv.innerHTML = savedData
    .map((data, index) => {
      // 데이터 검증
      if (!data || typeof data.netSalary !== 'number' || typeof data.totalSalary !== 'number' || typeof data.taxAmount !== 'number') {
        console.error("잘못된 데이터:", data);
        return '';
      }

      return `
        <div class="saved-result-item">
          <div class="result-content">
            <h3>${data.title}</h3>
            <div>실수령액: ${data.netSalary.toLocaleString()}원</div>
          </div>
          <button class="toggle-btn" onclick="toggleResultDetails(${index})">
            <i class="fa-solid fa-bars"></i>
          </button>
          <button class="delete-btn" onclick="deleteSavedResult(${index})">
            <i class="fa-solid fa-minus"></i>
          </button>
          <div id="details-${index}" class="result-details" style="display: none;">
            <div>총 급여: ${data.totalSalary.toLocaleString()}원</div>
            <div>세금: ${data.taxAmount.toLocaleString()}원</div>
            <div style="color: red;">실수령액: ${data.netSalary.toLocaleString()}원</div>
          </div>
        </div>
      `;
    })
    .join('');
}

// 저장된 결과 삭제 함수
function deleteSavedResult(index) {
  const savedData = JSON.parse(localStorage.getItem('savedSalaries')) || [];
  savedData.splice(index, 1);
  localStorage.setItem('savedSalaries', JSON.stringify(savedData));
  displaySavedResults();
}

function toggleResultDetails(index) {
  const detailsDiv = document.getElementById(`details-${index}`);
  const toggleButton = detailsDiv.previousElementSibling; // 토글 버튼
  const isCurrentlyVisible = detailsDiv.style.display === 'block';

  if (isCurrentlyVisible) {
    detailsDiv.style.display = 'none';  // 숨김
  } else {
    detailsDiv.style.display = 'block'; // 보이기
  }
}

// 페이지 로드 시 저장된 결과 불러오기 및 초기화 및 이벤트 리스너 등록
window.addEventListener('load', () => {
  displaySavedResults();
});

// 각 버튼에 대한 이벤트 리스너 등록
resetBtn.addEventListener('click', resetFields);
calculateBtn.addEventListener('click', calculateSalary);
saveBtn.addEventListener('click', saveData);

// 페이지 로드 시 저장된 결과 불러오기
// 초기화 및 이벤트 리스너 등록
//window.addEventListener('load', displaySavedResults);
//resetBtn.addEventListener('click', resetFields);
//calculateBtn.addEventListener('click', calculateSalary);
//saveBtn.addEventListener('click', saveData);

