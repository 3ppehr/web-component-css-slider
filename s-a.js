class sA extends HTMLElement {

render = () => `
<style>
	:host>* {
		box-sizing: border-box
	}

	:host {
		min-width: 80vw;
		min-height: 200px;
		font-family: Verdana, sans-serif;
		margin: 0;
	}

	

	img {
		vertical-align: middle;
		display: inline-block;
	}

	.slideshow-container {
		position: relative;
		width: 700px auto;
		max-width: 1000px;
		height: 350px;
		margin: 50px auto;
		border: 1px solid;
		overflow: hidden;

	}

	.slides {
		z-index: 0;
		width: 300%;
		height: 100%;
		position: relative;
	}

	a {
		display: block;
	}

	.slides>a {
		position: absolute;
		z-index: -1;
		opacity: 0;
	}

	.slides>a:last-child{
		z-index: 1;
		animation: fade01 7s;
	}
	
	@keyframes slider {
		from { transform: translateY(-50%) rotate(30deg); left: 360px; }
		to   { transform: translateY(-50%); left: 0px; }
	  }

	slides::before,
	slides::after {
		position: absolute;
		top: 48%;
		width: 35px;
		height: 35px;
		border: solid black;
		border-width: 0 4px 4px 0;
		padding: 3px;
		box-sizing: border-box;
		content: "";
		z-index: 1;
		background: none;
		pointer-events: none;
	}

	.prev,
	.next {
		cursor: pointer;
		position: absolute;
		top: 50%;
		width: auto;
		padding: 16px;
		margin-top: -22px;
		color: white;
		font-weight: bold;
		font-size: 18px;
		transition: 0.6s ease;
		border-radius: 0 3px 3px 0;
		user-select: none;
	}

	/* Position the "next button" to the right */
	.next {
		right: 0;
		border-radius: 3px 0 0 3px;
	}

	/* On hover, add a black background color with a little bit see-through */
	.prev:hover,
	.next:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}

	/* Caption text */
	section>a>div.text {

		color: #f2f2f2;
		font-size: 15px;
		padding: 12px;
		position: absolute;
		bottom: -50px;
		width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, .5);
		height: 50px;
		text-shadow: 0 3px 3px rgba(0, 0, 0, 1)
	}

	@keyframes txt {

		0% {
			bottom: -50px;
		}

		50% {
			bottom: 0;
		}

		100% {
			bottom: 0;
		}
	}

	@keyframes number {
		0% {
			top: -50px;
		}

		50% {
			top: 0;
		}

		100% {
			top: 0;
		}
	}

	section>a:last-child>div.text {
		animation: txt 2s;
	}

	/* Number text (1/3 etc) */
	section>a>div.numbertext {
		color: #f2f2f2;
		font-size: 12px;
		padding: 8px 12px;
		position: absolute;
		background-color: rgba(0, 0, 0, .3);
	}

	section>a:last-child>div.numbertext {
		animation: number 2s;
	}

	/* The dots/bullets/indicators */
	.dot {
		cursor: pointer;
		height: 15px;
		width: 15px;
		margin: 0 2px;
		background-color: #bbb;
		border-radius: 50%;
		display: inline-block;
		transition: background-color 0.6s ease;
	}

	.loader {
		border: 16px solid #f3f3f3;
		/* Light grey */
		border-top: 16px solid #3498db;
		/* Blue */
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.active,
	.dot:hover {
		background-color: #717171;
	}



	@keyframes fade01 {
		0% {
			opacity:0;
		}
		6% {
			opacity:.5;
		}
		24% {
			opacity:1;
		}
		30% {
			opacity:1;
		}
		70% {
			opacity:.5;
		}
		100% {
			opacity:0;
		}
	}

	@keyframes fade {
		0: {
			opacity: 0;
		}

		25%: {
			opacity: 1;
		}

		75%: {
			opacity: 1;
		}

		100%: {
			opacity: 0;
		}
	}

	/* On smaller screens, decrease text size */
	@media only screen and (max-width: 300px) {

		.prev,.next,.text {
			font-size: 11px
		}
	}
	}
</style>

<main>
	<div id="load" class="loader"></div>
	<div hidden id="slideshow" class="slideshow-container">

	<section class="slides"></section>


		<a class="prev">&#10094</a>
		<a class="next">&#10095</a>
		
	</div>
</main>
`
renderSlide = (i = 0, f = '', c = '', L = 0) => `

<div class="numbertext"> ${i} / ${L}</div>
<img src="./${f}" />
<div class="text">${c}
</div>

`
/*renderNav = () => `
<span class="dot" data-index="0"></span>
`*/

url = ''
main = null
slide = null
nav = null
color = 'white'

interval = null
slideIndex = 0;

constructor() {
super();
this.attachShadow({ mode: 'open' });

this.shadowRoot.innerHTML = this.render()

this.main = this.shadowRoot.querySelector('main');
this._section = this.main.querySelector('section')
this._progress = this.main.querySelector('aside');
this.slide = this.main.querySelector('.slideshow-container > section');
this.nav = this.main.querySelector('div:last-child');
}

connectedCallback() {
this._section.addEventListener('mouseover', e => {
//this._progress.style.animationPlayState = 'paused'
})

this._section.addEventListener('mouseout', e => {
// this._progress.style.animationPlayState = 'running'
})
this.loadData()
}

loadData() {
this.shadowRoot.getElementById("load").hidden = true;
this.shadowRoot.getElementById("slideshow").hidden = false;
fetch(this.url)
.then(response => {
response
.json()
.then(data => {
this.update(data)
})
})
}

update(data = []) {

console.log(data)

if (data.length > 0) {

this.slide.innerHTML = ''

let i = 0
for (const item of data) {
i++

let a = document.createElement('a')
a.innerHTML = this.renderSlide(i, item.filename, item.caption, data.length)
a.href = `#${item.b}`
a.target = '_blank'
a.addEventListener('animationend', e => {
this.slide.firstChild.before(this.slide.lastChild)
})

this.slide.appendChild(a)

let span = document.createElement('span')
span.classList.add('dot')
span.dataset.index = i - 1
span.addEventListener('click', e => {
let idx = parseInt(e.target.dataset.index)
console.log('dot', idx)
//this.currentSlide(idx)
this.showSlides(idx)
})

this.nav.appendChild(span)
//this.nav.innerHTML += this.renderNav()
}

/*this.nav.querySelectorAll(".dat").forEach(element => {
element.addEventListener('click', e => {
this.currentSlide()
})
});
*/

this.main.querySelector(".prev").addEventListener('click', e => {
console.log("ok bebe");
// console.log('prev', this.slideIndex - 1)
//this.currentSlide(this.slideIndex - 1);
//this.showSlides(this.slideIndex = this.slideIndex - 1)
this.previousClick(e)

})

this.main.querySelector(".next").addEventListener('click', e => {
console.log("ok bebe");
//console.log('next', this.slideIndex + 1)
//this.currentSlide(this.slideIndex + 1)
//this.showSlides(this.slideIndex = this.slideIndex + 1)
this.nextClick(e)
})

/*let nextSlide = function () {
this.currentSlide(this.slideIndex + 1)
}*/

// this.timer()
//this.slide.querySelector(".text").style.color = this.color;

this.addEventListener('mouseover', e => {
console.log("hi bebe")
clearInterval(this.interval)
})
this.addEventListener('mouseleave', e => {
console.log("bey bebe")
// this.timer()
})
this.showSlides(this.slideIndex)
}
}

previousClick(e){
this.slide.lastChild.after(this.slide.firstChild)
}

nextClick(e){
this.slide.firstChild.before(this.slide.lastChild)
}

timer() {
this.interval = setInterval(() => {
//this.currentSlide(this.slideIndex + 1)
this.showSlides(this.slideIndex = this.slideIndex + 1)
}, 5000);
}

disconnectedCallback() {
clearInterval(this.interval)
}
static get observedAttributes() {
return ['url', 'color'];
}

attributeChangedCallback(name, oldValue, newValue) {
if (name == 'url') {
this.url = newValue;
}

}

showSlides(n) {
let slides = this.main.querySelectorAll(".mySlides")

// console.log('before index:', this.slideIndex);
if (n >= slides.length) {
this.slideIndex = 0
}
if (n < 0) { this.slideIndex=slides.length - 1 } // console.log('after index:', this.slideIndex)
	slides.forEach(element=> {
	element.style.display = "block"
	});
	//slides[this.slideIndex].style.display = "block"

	let dots = this.main.querySelectorAll(".dot")
	dots.forEach(element => {
	element.classList.remove("active")
	});
	dots[this.slideIndex].classList.add("active")
	}

	}
	customElements.define('s-a', sA);

	/*class sA2 extends sA {
	renderNav = () => `
	<p class="dot"></p>
	`
	}

	customElements.define('s-a2', sA2);*/