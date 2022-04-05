// 打开地址：https://easy.lagou.com/resume/list.htm?can=false&famousCompany=0&needQueryAmount=false&pageNo=1

const SMART_CONFIG = {
    refreshTimes: 1800 * 1000,//单位秒
    account: 'd00566038',
    email: 'daiyaya@huawei.com',//需要校验是否以huawei.com结尾
    workPlace: ['南京', '成都'],
    language: ['java', 'js', 'c++']
}
var resumes = []
var lastData = ''

collectData()
setInterval(collectData, SMART_CONFIG.refreshTimes);

async function collectData() {
    console.log(`欢迎使用智能简历筛选工具。`);
    if (!check()) {
        console.warn(`当前网页内容不正确，没有包含简历库tab页。`);
        return
    }
    await refreshTab()
    const lastIndex = getLastIndex()
    let resumeData = await getResumeDataUntilIndex(lastIndex)
    resumeData = filterData(resumeData)

    console.log(resumeData);
}

function check() {
    return document.querySelector('.interview') && document.querySelector('.resume-library')
}

function refreshTab() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.querySelector('.interview').click()
            setTimeout(() => {
                document.querySelector('.resume-library').click()
                resolve()
            }, 800);
        }, 500);
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
        while (lastRecord && lastRecord.textContent.includes('今天')) {
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
}

function getCurrentResumeData(dom) {
    return new Promise((resolve, reject) => {
        const tableInfo = dom.textContent
        const nameLink = dom.querySelector('td')
        nameLink.click()

        setTimeout(() => {
            document.querySelector('.rc-tabs-tab').click()

            const shortInfo = document.querySelector('.p-thi').textContent
            const expectJob = document.querySelector('.expect-item').textContent.replace('icon_resume_positionCreated with Sketch.', '')

            resolve(`${tableInfo} | ${shortInfo} | ${expectJob}`)
        }, 500);
    })
}

function filterData(data = []) {
    return data.filter(content => {
        const isFillAddress = SMART_CONFIG.workPlace.some(item => {
            return content.includes(item)
        })

        const isFillLanguage = SMART_CONFIG.language.some(item => {
            return content.includes(item)
        })

        return isFillAddress && isFillLanguage
    })
}

