import anime from "animejs";

anime({
    targets: '#hello-world',
    rotate: '1turn',
    backgroundColor: '#FFF',
    duration: 800
});

anime({
    targets: '.css-selector-demo .el',
    translateX: 250
});

var battery = {
    charged: '0%',
    cycles: 0
}

const log = document.getElementById('log') as HTMLElement

anime({
    targets: battery,
    charged: '100%',
    cycles: 130,
    round: 100,
    easing: 'linear',
    update: () => {
        log.innerHTML = JSON.stringify(battery);
    }
});

anime({
    targets: '.css-prop-demo .el',
    left: '240px',
    backgroundColor: '#000',
    borderRadius: ['0%', '50%'],
    easing: 'easeInOutQuad'
});

anime({
    targets: '.css-transforms-demo .el',
    translateX: [150, 250],
    scale: 2,
    rotate: '1turn',
    delay: 1000
});

anime({
    targets: ['.svg-attributes-demo polygon', 'feTurbulence', 'feDisplacementMap'],
    points: '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96',
    baseFrequency: 0,
    scale: 1,
    direction: 'alternate',
    easing: 'easeInOutExpo',
    duration: 10000
});

anime({
    targets: '.css-specific-property-demo .el',
    translateX: {
        value: 250,
        duration: 800
    },
    rotate: {
        value: 360,
        duration: 1800,
        easing: 'easeInOutSine'
    },
    scale: {
        value: 2,
        duration: 1600,
        delay: 2000,
        easing: 'easeInOutQuart'
    },
    delay: 250 // All properties except 'scale' inherit 250ms delay
});