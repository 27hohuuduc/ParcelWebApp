import { data, subtitle } from "./define"

//Declare
const drop_zone = document.getElementById("drop_zone") as HTMLElement
const inputFile = document.getElementById('input-file') as HTMLInputElement
const progressContainer = document.getElementById('progress-container') as HTMLElement
const progress = document.getElementById('progress') as HTMLElement
const dropZone = document.getElementById('drop_zone') as HTMLElement
const videoPlayer = document.getElementById('video-player') as HTMLVideoElement
const timeDisplay = document.getElementById('time-display') as HTMLElement
const timeCurrent = timeDisplay.querySelector('.current') as HTMLElement
const subtitleContainer = document.getElementById('subtitles') as HTMLElement
const videoContainer = document.getElementById('video-container') as HTMLElement
const mainContainer = document.getElementById('main-container') as HTMLElement
const overlay = document.getElementById('overlay') as HTMLElement
const controls = document.getElementById('controls') as HTMLElement
function parseTime<T extends string | number>(time: T): T extends string ? number : string {
    if (typeof time === 'string') {
        const [hours, minutes, seconds] = time.split(':')
        return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds) as any
    }
    if (typeof time === 'number') {
        const hours = Math.floor(time / 3600).toString().padStart(2, '0')
        const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0')
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}` as any
    }
    return null as any
}

//Drag & drop
drop_zone.ondrop = (event) => {
    event.preventDefault()
    if (event.dataTransfer)
        handleFiles(event.dataTransfer.files)
}
drop_zone.ondragover = (event) => {
    event.preventDefault(),
        (event.dataTransfer as DataTransfer).dropEffect = 'copy'
}
inputFile.addEventListener('change', function () {
    if (this.files)
        handleFiles(this.files)
})
dropZone.addEventListener('click', function () {
    inputFile.click()
})

//Handle video
let deplay = 0

const subtitles: subtitle[] = []
document.getElementById('deplay')?.addEventListener('change', (e) => {
    deplay = (e.target as HTMLInputElement).valueAsNumber
})
async function handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Check if video
        if (file.type.startsWith('video/')) {
            loadVideo(file)
            return
        }
        else if (['vtt', 'srt'].includes(file.name.split('.').pop() as string)) {
            subtitles.push(...handleSub(await file.text()))
        }
        else
            alert("Please only input video or subtitle files (support vtt/srt)")
    }
}
function loadVideo(file: Blob) {
    videoContainer.style.display = 'block'
    videoPlayer.src = URL.createObjectURL(file)
    videoPlayer.style.display = 'block'
}
videoPlayer.addEventListener('timeupdate', () => {
    const { duration, currentTime } = videoPlayer
    const subtitle = subtitles.find(subtitle => currentTime >= subtitle.start + deplay && currentTime <= subtitle.end + deplay)
    console.log(currentTime, subtitle?.text)
    subtitleContainer.innerHTML = subtitle ? subtitle.text : ''

    progress.style.width = `${currentTime / duration * 100}%`
    timeCurrent.innerText = parseTime(currentTime)
})
videoPlayer.addEventListener('loadedmetadata', () => {
    (timeDisplay.querySelector('.duration') as HTMLElement).innerText = parseTime(videoPlayer.duration)
})
videoPlayer.addEventListener('play', () => {
    videoContainer.setAttribute(data.playing, 'true')
})
videoPlayer.addEventListener('pause', () => {
    videoContainer.setAttribute(data.playing, 'false')
})

//Handle subtitles
function handleSub(vtt: string): subtitle[] {

    const subtitle: subtitle[] = []

    let start = 0, end = 0, text: string = ''
    for (let line of vtt.split('\n')) {
        if (line.includes('-->')) {
            const times = line.split(' --> ')
            start = parseTime(times[0])
            end = parseTime(times[1])
            text = ''
        } else if (line.trim() === '') {
            subtitle.push({ start, end, text })
            start = end = 0
            text = ''
        } else {
            if (text.trim() !== '')
                text += '\n'
            text += line
        }
    }

    if (text.trim() !== '') {
        subtitle.push({ start, end, text })
    }

    return subtitle
}

//Handle Controls
let mousedown = false
progressContainer.addEventListener('click', setProgress)
progressContainer.addEventListener('mousedown', () => {
    mousedown = true
})
progressContainer.addEventListener('mouseup', (e: MouseEvent) => {
    mousedown = false
    setProgress(e)
})
progressContainer.addEventListener('mousemove', (e: MouseEvent) => {
    if (mousedown)
        setProgress(e)
})
function setProgress(e: MouseEvent) {
    videoPlayer.currentTime = (e.offsetX / progressContainer.clientWidth) * videoPlayer.duration
}
progressContainer.addEventListener('mouseleave', () => {
    if (mousedown)
        mousedown = false
})
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        skipVideo(videoPlayer, -5)
    } else if (e.key === 'ArrowRight') {
        skipVideo(videoPlayer, 5)
    }
})
function skipVideo(video: HTMLVideoElement, s: number) {
    video.currentTime += s
}
overlay.addEventListener('click', () => {
    const paused = videoPlayer.paused
    if (paused)
        videoPlayer.play()
    else
        videoPlayer.pause()
})
mainContainer.addEventListener('dblclick', () => {
    if (document.fullscreenElement)
        document.exitFullscreen()
    else
        document.documentElement.requestFullscreen()
})
document.addEventListener('fullscreenchange', (e) => {
    const _ = [mainContainer, overlay]
    if (document.fullscreenElement) {
        _.forEach(e => e.setAttribute(data.state, 'fullscreen'))
    }
    else
        _.forEach(e => e.setAttribute(data.state, 'none'))
})
let timeout: number
overlay.addEventListener('mousemove', () => {
    controls.setAttribute(data.actived, 'true')
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        controls.setAttribute(data.actived, 'false')
    }, 2000)
})
overlay.addEventListener('mouseleave', () => {
    clearTimeout(timeout)
    controls.setAttribute(data.actived, 'false')
})