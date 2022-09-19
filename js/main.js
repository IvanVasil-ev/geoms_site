window.scrollTo(0, 0);

window.addEventListener('load', () => {
    // <!-- Selectors  -->
    const DOCUMENT = document.getElementById('html');
    const BODY = document.getElementById('body');

    const SIDEBAR = document.getElementById('sidebar');
    const FLOAT_BUTTON = document.getElementById('float_button');
    const SIDEBAR_CLOSE = document.getElementById('sidebar-close');

    const CAROUSEL = document.getElementById('carousel');
    const IMAGE_PREVIEW = document.getElementById('image-preview');
    const PREVIEW_CLOSE_BUTTON = document.getElementById('preview-close');
    const PREV_ARROW_BUTTON = document.getElementById('carousel-prev-arrow');
    const NEXT_ARROW_BUTTON = document.getElementById('carousel-next-arrow');

    const MAIN_BLOCK = document.getElementById('main');

    const WELCOME_BLOCK = document.getElementById('welcome');
    const WELCOME_SQUARE = document.getElementById('welcome-square');
    const WELCOME_FLOAT = document.getElementById('welcome-float');

    const ABOUT_BLOCK = document.getElementById('about');
    const ABOUT_WHO = document.getElementById('about__who');
    const WHAT_WE_WANT = document.getElementById('what-we-want');

    const GALLERY_BLOCK = document.getElementById('gallery');

    const PROGRESS = document.getElementById('progress');

    const TEXT_FADES = Array.from(document.querySelectorAll('.text-fades'));

    // <!-- Onload  -->
    MAIN_BLOCK.classList.add('main_opacity_visible');

    // <!-- Constants -->
    const bodyBlockRect = BODY.getBoundingClientRect();
    const welcomeBlockRect = WELCOME_BLOCK.getBoundingClientRect();
    const welcomeFloatRect = WELCOME_FLOAT.getBoundingClientRect();
    const aboutBlockRect = ABOUT_BLOCK.getBoundingClientRect();
    const galleryBlockRect = GALLERY_BLOCK.getBoundingClientRect();
    const fadeRects = [];
    (() => TEXT_FADES.forEach((item) => {
        const { y: tValue, height } = item.getBoundingClientRect();
        const bValue = tValue + height;

        fadeRects.push({item, tValue, bValue });
    }))();

    // <!-- Functions  -->
    const setTextVisible = ({ item = null }) => {
        if (!item) return;

        const itemIndex = TEXT_FADES.findIndex((rect) => rect === item);
        if (itemIndex === -1) return;

        const itemRect = fadeRects[itemIndex];
        const { tValue, bValue } = itemRect;
        const scrollTValue = window.scrollY;
        const scrollBValue = scrollTValue + window.innerHeight;
        const isItemTopVisible = (tValue >= scrollTValue) && (tValue <= scrollBValue);
        const isItemBotVisible = (bValue >= scrollTValue) && (bValue <= scrollBValue);
        const isItemVisible = isItemBotVisible || isItemTopVisible;

        if (isItemVisible && item.style.opacity === '0') {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = ' translateX(0)';
            }, 500);
        }
    };

    setTimeout(() => {
        TEXT_FADES.forEach((item) => setTextVisible({ item }));
        document.getElementById('html').style.scrollBehavior = 'smooth';
    }, 1000);

    const toggleSidebar = () => {
        DOCUMENT.classList.toggle('scroll-lock');
        SIDEBAR.classList.toggle('sidebar-hidden');
    };

    const togglePreview = ({ index = null }) => {
        if (index !== null) CAROUSEL.style.transform = `translateX(${index * innerWidth * -1}px)`;

        DOCUMENT.classList.toggle('scroll-lock');
        IMAGE_PREVIEW.classList.toggle('image-preview-hidden');
    };

    const toggleImage = ({ direction = 'next' }) => {
        const { width } = CAROUSEL.getBoundingClientRect();
        const transform = Number(CAROUSEL.style.transform.slice(11, -3));
        const windowWidth = window.innerWidth;
        const isNextDirection = direction === 'next';
        const isFirstImage = transform === 0;
        const lastImageTransform = (width - windowWidth) * -1
        const isLastImage = transform === lastImageTransform;
        const nextTransition = isNextDirection ? (transform - windowWidth) : (transform + windowWidth);

        if (isFirstImage && !isNextDirection) return CAROUSEL.style.transform = `translateX(${lastImageTransform}px)`;
        if (isLastImage && isNextDirection) return CAROUSEL.style.transform = 'translateX(0px)';

        return CAROUSEL.style.transform = `translateX(${nextTransition}px)`;
    };

    const getValueByPercent = (config, { offset = 0, startFromTop = true, inPercent = false, withConsole = false }) => {
        if (!config) {
            return;
        }

        const { y, height } = config;
        const elementHeight = y + height;
        const scrollTopValue = window.scrollY;
        const scrollBotValue = window.scrollY + window.innerHeight;
        const isBlockVisible = scrollTopValue < elementHeight && scrollBotValue > y;
        const percent = (height + offset + startFromTop ? window.innerHeight : 0) / 100;
        const fullHeight = startFromTop ? scrollBotValue : scrollTopValue;
        const coverage = (fullHeight - y) / percent;
        const minMaxCoverage = coverage >= 100 ? 100 : coverage <= 0 ? 0 : coverage;
        const getNewValueInPercent = () => scrollTopValue / ((height - window.innerHeight) / 100);

        const getValue = ({ min = 0, max = 1 }) =>
          min > 0 ? 1 + minMaxCoverage * (max / 100) : minMaxCoverage * (max / 100);
        const getNewValueInNumber = ({ min = 0, max = 1 }) =>
          getValue({ min, max }) > max ? max : getValue({ min, max });

        const getNewValue = inPercent ? getNewValueInPercent : getNewValueInNumber;
        if (withConsole) console.log(elementHeight, fullHeight);

        return [isBlockVisible, getNewValue];
    };

    // <!-- Listeners  -->
    window.addEventListener('scroll', () => {
        const [isBodyBlock, getBodyValue] = getValueByPercent({ y: 0, height: 4325 }, { startFromTop: false, inPercent: true });
        const [isWelcomeBlock, getWelcomeValue] = getValueByPercent(welcomeBlockRect, { startFromTop: false });
        const [isAboutBlock, getAboutValue] = getValueByPercent(aboutBlockRect, {});
        const [isGalleryBlock, getGalleryValue] = getValueByPercent(galleryBlockRect, {});

        TEXT_FADES.forEach((item) => setTextVisible({ item }));

        if (isBodyBlock) {
            PROGRESS.style.width = `${getBodyValue()}%`;
        } else {
            PROGRESS.style.width = '0';
        }

        if (isWelcomeBlock) {
            const newScale = getWelcomeValue({ min: 1, max: 2 });
            const newRotate = getWelcomeValue({ max: 90 });
            WELCOME_SQUARE.style.transform =  `scale(${newScale}, ${newScale}) rotate(-${newRotate}deg)`;
        } else {
            WELCOME_SQUARE.style.transform = 'scale(1, 1) rotate(0deg)';
        }

        if (isAboutBlock) {
            const newScale = getAboutValue({ min: 1, max: 2 });
            ABOUT_WHO.style.transform = `scale(${newScale}, ${newScale})`;
        } else {
            ABOUT_WHO.style.transform = 'scale(1, 1)';
        }

        if (isGalleryBlock) {
            const newOpacity = getGalleryValue({ min: 0.4, max: 1 });
            const newRotate = getGalleryValue({ max: 90 });
            const newScale = getGalleryValue({ min: 1, max: 2 });
            const newTranslateX = getGalleryValue({ max: 600 });
            const newTranslateY = getGalleryValue({ max: 750 });

            WHAT_WE_WANT.style.opacity = newOpacity;
            WHAT_WE_WANT.style.transform = `rotate(-${newRotate}deg) translateX(max(-${newTranslateX/10}rem, -${newTranslateX}px)) translateY(min(${newTranslateY/10}rem, ${newTranslateY}px)) scale(${newScale}, ${newScale})`;
        } else {
            WHAT_WE_WANT.style.opacity = '1';
            WHAT_WE_WANT.style.transform = `scale(1, 1) translate(0, 0) rotate(0deg)`;
        }

    }, { capture: true });

    WELCOME_BLOCK.addEventListener('mousemove', ({ clientY, clientX }) => {
        const { y, x } = welcomeFloatRect;
        WELCOME_FLOAT.style.transform = `translate3d(${x - clientX}px, ${y - clientY}px, 0px)`;
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', () => toggleSidebar());
    });

    window.addEventListener('keydown', (e) => {
        const { display } = getComputedStyle(IMAGE_PREVIEW);
        if (display !== 'none') {
            if (e.key === 'Escape') togglePreview({});
            if (e.key === 'ArrowLeft') toggleImage({ direction: 'prev' });
            if (e.key === 'ArrowRight') toggleImage({});
        }
    });

    PREV_ARROW_BUTTON.addEventListener('click', () => toggleImage({ direction: 'prev' }));
    NEXT_ARROW_BUTTON.addEventListener('click', () => toggleImage({}));
    PREVIEW_CLOSE_BUTTON.addEventListener('click', () => togglePreview({}));
    document.querySelectorAll('.gallery__photos > *').forEach((item, index) =>
        item.addEventListener('click', () => togglePreview({ index })));

    FLOAT_BUTTON.addEventListener('click', () => toggleSidebar());
    SIDEBAR_CLOSE.addEventListener('click', () => toggleSidebar());
    SIDEBAR.addEventListener('click', (e) => e.target === SIDEBAR && toggleSidebar());
});
