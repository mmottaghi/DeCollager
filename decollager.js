const el = {
    smallStep: document.getElementById('smallStep'),
    canv: document.getElementById('canv'),
    inp: {
        w: document.getElementById('inpW'),
        h: document.getElementById('inpH'),
    },
    output: document.getElementById('output'),
    clipCount: document.getElementById('clip-counter'),
    imgPath: document.getElementById('img-path'),
    srcImg: document.getElementById('src-img'),
    template: document.querySelector('body > div:last-of-type'),
};

let ctx = el.canv.getContext('2d');

let clip = {
    w: parseInt(el.inp.w.value),
    h: parseInt(el.inp.h.value),
    xOfs: 0,
    yOfs: 0,
    old: {w:-1, h:-1},
}

function deleteClips()
{
    while(el.output.firstChild)
        el.output.removeChild(el.output.firstChild);
    el.clipCount.innerHTML = '';
}

function deleteSelectedClips()
{
    el.output.querySelectorAll('input[type="checkbox"]:checked').forEach(cl => el.output.removeChild(cl.parentElement.parentElement))
    el.clipCount.innerHTML = "Clip Count: " + el.output.childElementCount;
}

function updateCanvas(xx, yy)
{
    clip.xOfs = xx;
    clip.yOfs = yy;

    if (clip.h!=clip.old.h || clip.w!=clip.old.w) {
        el.canv.width = clip.w;
        el.canv.height = clip.h;
        clip.old.h = clip.h;
        clip.old.w = clip.w;
        el.output.style.width = ''+clip.w+'px';
    }              

    ctx.clearRect(0, 0, el.canv.width, el.canv.height);
    ctx.drawImage(el.srcImg, xx, yy, clip.w, clip.h, 0, 0, clip.w, clip.h);
}

el.srcImg.addEventListener('mousemove', e => updateCanvas(e.offsetX, e.offsetY));

el.srcImg.addEventListener("wheel", e => {
    if (!e.shiftKey)
        return;
    let step = el.smallStep.checked? 1:10;
    let delta = e.wheelDelta<0? -step : step;
    if (e.altKey) {
        clip.h += delta;
        if (clip.h<5)
            clip.h = 5;
        el.inp.h.setAttribute('value', clip.h);
    }
    else {
        clip.w += delta;
        if (clip.w<5)
            clip.w = 5;
        el.inp.w.setAttribute('value', clip.w);
    }
    updateCanvas(clip.xOfs, clip.yOfs);
});

el.srcImg.addEventListener('click', e => {
    let newClip = el.template.cloneNode(true)
    let newCanv = newClip.querySelector('canvas');
    newCanv.width = clip.w;
    newCanv.height = clip.h;
    newCanv.getContext('2d').drawImage(el.srcImg, e.offsetX, e.offsetY, clip.w, clip.h, 0, 0, clip.w, clip.h);            
    el.output.prepend(newClip);

    el.clipCount.innerHTML = "Clip Count: " + el.output.childElementCount;
});

document.body.addEventListener("keydown", e => {
    if (e.keyCode == 113)
        el.smallStep.checked = !el.smallStep.checked;
});

function loadImage()
{
    el.srcImg.setAttribute('src', el.imgPath.value );
}
