// document.body.style.backgroundColor="red";
var startStatisticIndex = 2;
var count = 0;
var allHeaderElements = document.getElementsByClassName('timeline-comment-header');
var allCommentElements = document.getElementsByClassName('js-comment-body');

var firstCommentElement = allCommentElements[0];

// 重要！！！ 触发条件，第一个评论区包含“auto statistic”，防止误操作
if (firstCommentElement.innerHTML.indexOf('auto statistic') !== -1) {
    var collectedContent = collectData(allCommentElements);
    // 提交数据
    var editCommentArea = document.getElementsByClassName('comment-form-textarea')[startStatisticIndex - 1];
    editCommentArea.innerHTML = collectedContent;
    var commitBtn = document.getElementsByClassName('btn-primary')[startStatisticIndex];
	
    commitBtn.click();

    linkClickEvent();
}

function collectData(elements) {
    var result = '';
    for (var i = startStatisticIndex; i < elements.length; i++) {
        var taskElements = document.getElementsByClassName('js-comment-body')[i].getElementsByClassName('task-list-item');
        if (taskElements.length > 0) {
            var link = allHeaderElements[i].getElementsByTagName('a')[1].href;
            var text = taskElements[0].textContent;

            // get status
            var status = ' ';
            var checkboxElement = taskElements[0].getElementsByTagName('input')[0];
            if(checkboxElement.hasAttribute('checked')) {
                status = 'x';
				count =count+1;
            }
            result += '- [' + status + '] <span>'+(i - startStatisticIndex + 1)+'、</span><a href="' + link + '">' + text + '</a>\r\n';
        }
    }
	result = '### 自动生成的统计信息： \r\n共有问题：' + (elements.length - startStatisticIndex) + '个\r\n已经解决问题：' + count + '个 \r\n' + result;
    return result;
}

function linkClickEvent(){
    // click checkbox事件，唯有此处dom不会被刷新
    var allCommentArea = document.getElementsByClassName('js-comment-container');
    var statisticCommentArea = allCommentArea[startStatisticIndex - 1];
    statisticCommentArea.addEventListener('click', function(e){
        var checkboxDom = e.srcElement;
        if(checkboxDom.className === 'task-list-item-checkbox') {
            var index = parseInt(checkboxDom.nextSibling.textContent.replace(/\s/g,''));
            var linkedCommentArea = allCommentArea[index + startStatisticIndex - 1]
            linkedCommentArea.getElementsByClassName('task-list-item-checkbox')[0].click()            
        }        
    });
}
