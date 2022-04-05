// 打开地址：https://easy.lagou.com/resume/list.htm?can=false&famousCompany=0&needQueryAmount=false&pageNo=1
console.log(`欢迎使用智能简历筛选工具。`);

const SMART_CONFIG = {
    refreshTimes: 15,//单位分钟
    account: 'd00566038',
    email: 'daiyaya@huawei.com',//需要校验是否以huawei.com结尾
    workPlace: ['南京', '成都'],
    languages: ['java', 'js', 'c++']
}

var lastData = ''

collectData()
setInterval(collectData, SMART_CONFIG.refreshTimes * 1000 * 60);

async function collectData() {
    if (!check()) {
        console.warn(`当前网页内容不正确，没有包含简历库tab页。`);
        return
    }
    await refreshTab()
    const lastIndex = getLastIndex()
    let resumeData = await getResumeDataUntilIndex(lastIndex)
    resumeData = filterData(resumeData)

    // 关闭弹窗
    closePopup()
    // 更新lastData
    updateLastData()

    console.log(resumeData);
}

function check() {
    return document.querySelector('.interview') && document.querySelector('.resume-library')
}

function refreshTab() {
    return new Promise(async (resolve, reject) => {
        await waitElement('.interview')
        document.querySelector('.interview').click()
        await waitElement('.resume-library')
        document.querySelector('.resume-library').click()
        resolve()
    })
}

function getLastIndex() {
    let index = 0
    let lastRecord = document.querySelector(`[data-row-key="${index}"]`)
    if (lastData) {
        // 1. 先找上次更新的
        while (lastRecord) {
            if (lastRecord.textContent === lastData) {
                return index
            }
            index++
            lastRecord = document.querySelector(`[data-row-key="${index}"]`)
        }

        // 2. 返回今天的（沒找到上次更新的）
        return _getTodayIndex()
    } else {
        // 3. 返回今天更新的
        return _getTodayIndex()
    }

    function _getTodayIndex() {
        index = 0
        lastRecord = document.querySelector(`[data-row-key="${index}"]`)
        while (lastRecord && lastRecord.textContent.includes('04月04日')) {
            index++
            lastRecord = document.querySelector(`[data-row-key="${index}"]`)
        }
        return index
    }
}

async function getResumeDataUntilIndex(untilIndex) {
    index = 0
    current = document.querySelector(`[data-row-key="${index}"]`)
    const infos = []
    while (current && index < untilIndex) {
        const curInfo = await getCurrentResumeData(current)
        infos.push(curInfo)
        index++
        current = document.querySelector(`[data-row-key="${index}"]`)
    }
    return infos
}

function getCurrentResumeData(dom) {
    return new Promise(async (resolve, reject) => {
        const tableInfo = dom.textContent
        const nameLink = dom.querySelector('td')
        nameLink.click()

        await waitElement('.rc-tabs-tab')
        setTimeout(async () => {
            document.querySelector('.rc-tabs-tab').click()
            const shortInfo = document.querySelector('.p-thi').textContent
            await waitElement('.expect-item')
            const expectJob = document.querySelector('.expect-item').textContent.replace('icon_resume_positionCreated with Sketch.', '')
            resolve(`${tableInfo} | ${shortInfo} | ${expectJob}`)
        }, 1500);
    })
}

function filterData(data = []) {
    return data.filter(content => {
        const lowerContent = content.toLocaleLowerCase()
        const isFillAddress = SMART_CONFIG.workPlace.some(item => {
            return lowerContent.includes(item)
        })

        const isFillLanguage = SMART_CONFIG.languages.some(item => {
            return lowerContent.includes(item)
        })

        return isFillAddress && isFillLanguage
    })
}

function waitElement(selector) {
    return new Promise((resolve, reject) => {
        let waitCount = 0
        _wait()
        function _wait() {
            waitCount++
            if (waitCount > 40) {
                console.log(`wait ${selector} timeout.`);
            }
            if (!document.querySelector(selector)) {
                setTimeout(() => {
                    _wait()
                }, 50);
            } else {
                resolve()
            }
        }
    })
}

function closePopup() {
    const closeBtn = document.querySelector('.switch-close')
    if (closeBtn) {
        closeBtn.click()
    }
}

function updateLastData() {
    lastData = document.querySelector(`[data-row-key="0"]`).textContent
}