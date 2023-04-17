const subjectElements = document.getElementsByClassName('align_left');
const subjectArray = [];
var done_task = 0
var not_task = 0
for (let i = 0; i < subjectElements.length; i++) {
  const subject = subjectElements[i].innerText.trim();
  const reportLimitDates = subjectElements[i].parentElement.getElementsByClassName('report_limit_date');
  const reportLimitDateArray = Array.from(reportLimitDates).map(td => td.innerText.trim().replace(/[\s-]/g, ''));

  const reportProgresses = subjectElements[i].parentElement.nextElementSibling.getElementsByClassName('report_progress');
  const reportProgressArray = Array.from(reportProgresses).map(td => td.innerText.trim().replace('%', ''));

  const filteredReportLimitDateArray = reportLimitDateArray.filter(date => date !== "" && date !== "-");
  const filteredReportProgressArray = reportProgressArray.filter(progress => progress !== "" && progress !== "-");

  const subjectInfo = {
    subject: subject,
    reportLimitDates: filteredReportLimitDateArray,
    reportProgresses: filteredReportProgressArray
  };
  subjectArray.push(subjectInfo);
}
const subjects = subjectArray.map(subjectInfo => {
  const subject = subjectInfo.subject;
  const reportLimitDates = subjectInfo.reportLimitDates;
  const reportProgresses = subjectInfo.reportProgresses;
  const subjectsOutput = {
    subject: subject,
    reportLimitDates: reportLimitDates,
    reportProgresses: reportProgresses
  };
  return subjectsOutput;

});
const resultContainer = document.getElementById('container');
resultContainer.innerHTML = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.18/dist/tailwind.min.css">
<div class="container mx-auto px-4 py-8">

    <div class="mb-1">
        <p class="text-gray-700 text-lg font-bold"></p>

        <div class="flex flex-wrap mt-2 px-4 py-2">
            <!-- 課題数 -->
            <div class="w-1/2">
                <div class="mb-4 w-40">
                    <label class="block text-gray-700 text-sm font-bold" for="deadline">
                        期限
                    </label>
                    <!-- プルダウン（提出期限選択） -->
                    <select
                        class="w-full px-4 py-2 my-3 rounded-md bg-white border border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500"
                        id="dates">
                        <option class="my-5">すべて</option>
                    </select>
                </div>
            </div>
            <div class="w-1/2">
                <label class="block text-gray-700 text-sm font-bold" for="deadline">
                    モード切り替え
                </label>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    <a href="https://secure.nnn.ed.jp/mypage/result/pc/list/index"><p class="text-white">N高成績確認（従来）</p></a>
                </button>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 my-3 rounded ">
                    <a href="https://s-secure.nnn.ed.jp/mypage/result/pc/list/index"><p class="text-white">S高成績確認（従来）<p></a>
                </button>
            </div>
        </div>
    </div>
    <div class="mb-1">
        <p class="text-gray-700 text-lg font-bold"></p>

        <div class="flex mt-2">
            <!-- 課題数 -->
            <div class="w-1/3">
                <p class="text-gray-700">課題数</p>
                <p class="text-3xl font-bold my-3" id="task"></p>
            </div>
            <div class="w-1/3">
                <p class="text-gray-700" id="times_alt">残り</p>
                <p class="text-3xl my-3 font-bold" id="times"></p>
            </div>
            <div class="w-1/3">
                <p class="text-gray-700">完了度</p>
                <p class="text-3xl my-3 font-bold" id="gauge"></p>
            </div>
        </div>
    </div>
    <hr>
    <!-- 未完了教科 -->
    <div id="filter">
        <p class="text-gray-700 text-lg font-bold" id="not_message">未完了教科</p>
        <div>
            <div class="flex flex-wrap -mx-4 font-bold" id="not">
            </div>
        </div>
        <p class="text-gray-700 text-lg font-bold" id="done_message">完了教科</p>
        <div class="flex flex-wrap -mx-4 font-bold" id="done">

        </div>
    </div>
</div>
</div>
</div>
`;
const done_html_code = `
    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-8">
        <div class="bg-white shadow-lg rounded-lg p-6 h-full" id="result" style="display:block;">
            <h2 class="text-xl font-semibold mb-4">{subject}</h2>
            <div class="mb-4">
                <div class="text-sm text-gray-600 mb-2">進捗度</div>
                <div class="text-sm text-green-600">{reportProgresses[j]}%</div>
                <div class="h-4 bg-blue-200 rounded-full">
                    <div class="h-full bg-green-500 rounded-full" style="width: {reportProgresses[j]}%;"></div>
                </div>
            </div>
            <div class="text-sm text-gray-600">期限:{reportLimitDates[j]}</div>
            <div class="text-sm text-green-600">完了済み</div>
        </div>
    </div>
`;
const not_html_code = `
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-8">
<div class="bg-white shadow-lg rounded-lg p-6 h-full" id="result" style="display:block;">
    <h2 class="text-xl font-semibold mb-4">{subject}</h2>
    <div class="mb-4">
        <div class="text-sm text-gray-600 mb-2">進捗度</div>
        <div class="text-sm text-red-600">{reportProgresses[j]}%</div>
        <div class="h-4 bg-blue-200 rounded-full">
            <div class="h-full bg-red-500 rounded-full" style="width: {reportProgresses[j]}%;"></div>
        </div>
    </div>
    <div class="text-sm text-red-600">期限:{reportLimitDates[j]}</div>
    <div class="text-sm text-red-600">未完了</div>
</div>
</div>
`;
const completedSubjects = [];
const incompleteSubjects = [];
for (let i = 0; i < subjects.length; i++) {
  const subject = subjects[i].subject;
  const reportLimitDates = subjects[i].reportLimitDates;
  const reportProgresses = subjects[i].reportProgresses;
  if (reportProgresses.every(progress => Number(progress) >= 100)) {
    completedSubjects.push({
      subject: subject,
      reportLimitDates: reportLimitDates,
      reportProgresses: reportProgresses
    });
  } else {
    incompleteSubjects.push({
      subject: subject,
      reportLimitDates: reportLimitDates,
      reportProgresses: reportProgresses
    });
  }
}
const createSelectOptions = (options) => {
  let selectOptions = '';
  options.forEach(option => {
    selectOptions += `<option value="${option}">${option}</option>`;
  });
  selectOptions += `<option value="すべて">すべて</option>`;
  return selectOptions;
};
const reportLimitDatesList = [...new Set(subjects.flatMap(subject => subject.reportLimitDates))].sort((a, b) => {
  const [aMonth, aDay] = a.split('/');
  const [bMonth, bDay] = b.split('/');
  return new Date(2021, aMonth - 1, aDay) - new Date(2021, bMonth - 1, bDay);
});

const selectOptions = createSelectOptions(reportLimitDatesList);
const selectElement = document.getElementById('dates');
selectElement.innerHTML = selectOptions;
function color() {
  if (document.getElementById("gauge").textContent == "100%") {
    document.getElementById("gauge").style.color = "#009D5B"
  }
  else {
    document.getElementById("gauge").style.color = "#F15B5B"
  }
}
selectElement.addEventListener('change', () => {
  intervalId = setInterval(updateTime, 1000);
  document.getElementById("not").innerHTML = ""
  document.getElementById("done").innerHTML = ""
  done_task = 0
  not_task = 0
  if (selectElement.value == "すべて") {
    all_filter()
    document.getElementById("times").innerText = "";
    document.getElementById("times_alt").innerText = "";
  }
  else {
    day_filter(selectElement.value);
    var all_task = not_task + done_task;
    document.getElementById("task").innerHTML = `${done_task}/${all_task}`;
    document.getElementById("times").innerText = "計算中...";
    color()
  }
});
function updateTime() {
  if (selectElement.value !== "すべて") {
    const deadlineStr = selectElement.value;
    const deadlineArr = deadlineStr.split("/");
    const deadlineMonth = parseInt(deadlineArr[0]) - 1;
    const deadlineDay = parseInt(deadlineArr[1]);
    const deadline = new Date(new Date().getFullYear(), deadlineMonth, deadlineDay);
    const now = new Date();
    if (now > deadline) {
      document.getElementById("times").innerText = "期限切れ";
      document.getElementById("times").style.color = "#F15B5B"
    } else {
      const timeDifference = deadline - now;
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById("times").innerText = days + 1 + "日" + hours + "時間" + minutes + "分";
      document.getElementById("times").style.color = "#009D5B"
    } document.getElementById("times_alt").innerHTML = "残り"

  }
  else {
    return
  }
}
function all_filter() {
  for (let i = 0; i < subjects.length; i++) {

    const subject = subjects[i].subject;
    const reportLimitDates = subjects[i].reportLimitDates;
    const reportProgresses = subjects[i].reportProgresses;
    for (let j = 0; j < reportLimitDates.length; j++) {
      if (reportProgresses[j] == 100) {
        const done_html = done_html_code.replace(/\{subject}/g, subject)
          .replace(/\{reportProgresses\[j\]}/g, reportProgresses[j])
          .replace(/\{reportLimitDates\[j\]}/g, reportLimitDates[j]);
        document.getElementById("done").insertAdjacentHTML('afterbegin', done_html);
        done_task++;
      }
      else {
        const not_html = not_html_code.replace(/\{subject}/g, subject)
          .replace(/\{reportProgresses\[j\]}/g, reportProgresses[j])
          .replace(/\{reportLimitDates\[j\]}/g, reportLimitDates[j]);
        document.getElementById("not").insertAdjacentHTML('afterbegin', not_html);
        not_task++;
      }
    }
    var all_task = not_task + done_task;
    document.getElementById("task").innerHTML = `${done_task}/${all_task}`
    var completion_rate = (done_task / all_task) * 100;
    var rounded_completion_rate = Math.round(completion_rate * 100) / 100;
    document.getElementById("gauge").innerText = rounded_completion_rate.toFixed(2) + "%";
  }
}
function day_filter(dates) {
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i].subject;
    const reportLimitDates = subjects[i].reportLimitDates;
    const reportProgresses = subjects[i].reportProgresses;
    for (let j = 0; j < reportLimitDates.length; j++) {
      if (reportLimitDates[j] == dates) {
        if (reportProgresses[j] == 100) {
          const done_html = done_html_code.replace(/\{subject}/g, subject)
            .replace(/\{reportProgresses\[j\]}/g, reportProgresses[j])
            .replace(/\{reportLimitDates\[j\]}/g, reportLimitDates[j]);
          document.getElementById("done").insertAdjacentHTML('afterbegin', done_html);
          done_task++;
        }
        else {
          const not_html = not_html_code.replace(/\{subject}/g, subject)
            .replace(/\{reportProgresses\[j\]}/g, reportProgresses[j])
            .replace(/\{reportLimitDates\[j\]}/g, reportLimitDates[j]);
          document.getElementById("not").insertAdjacentHTML('afterbegin', not_html);
          not_task++;
        }
      }
    }
  }
  var all_task = not_task + done_task;
  document.getElementById("task").innerHTML = `${done_task}/${all_task}`
  var completion_rate = (done_task / all_task) * 100;
  var rounded_completion_rate = Math.round(completion_rate * 100) / 100;
  document.getElementById("gauge").innerText = rounded_completion_rate.toFixed(2) + "%";
}
function start() {
  day_filter(selectElement.value);
  setInterval(updateTime, 1000);
  document.getElementById("times").innerText = "計算中...";
  color()
}
start()
