// document.body.style.backgroundColor="red";
var startStatisticIndex = 2;

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
            }

            result += '- [' + status + '] <a href="' + link + '">' + text + '</a>\r\n';
        }
    }

    return result;
}