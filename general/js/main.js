window.scrollTo(0, 0);

window.addEventListener('load', () => {
    // <!-- Selectors  -->
    const DOCUMENT = document.getElementById('html');

    const SIDEBAR = document.getElementById('sidebar');
    const FLOAT_BUTTON = document.getElementById('float_button');
    const SIDEBAR_CLOSE = document.getElementById('sidebar-close');

    const MAIN_BLOCK = document.getElementById('main');

    const WELCOME_BLOCK = document.getElementById('welcome');
    const WELCOME_SQUARE = document.getElementById('welcome-square');
    const WELCOME_FLOAT = document.getElementById('welcome-float');

    const ABOUT_BLOCK = document.getElementById('about');
    const ABOUT_WHO = document.getElementById('about__who');

    // <!-- Onload  -->
    MAIN_BLOCK.classList.add('main_opacity_visible');

    // <!-- Constants -->
    const welcomeBlockRect = WELCOME_BLOCK.getBoundingClientRect();
    const welcomeFloatRect = WELCOME_FLOAT.getBoundingClientRect();
    const aboutBlockRect = ABOUT_BLOCK.getBoundingClientRect();

    // <!-- Functions  -->
    const toggleSidebar = () => {
        DOCUMENT.classList.toggle('scroll-lock');
        SIDEBAR.classList.toggle('sidebar-hidden');
    };

    const getValueByPercent = (config, { offset = 0, startFromTop = true }) => {
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
        const getValue = ({ min = 0, max = 1 }) =>
          min > 0 ? 1 + coverage * (max / 100) : coverage * (max / 100);

        const getNewValue = ({ min = 0, max = 1 }) =>
          getValue({ min, max }) > max ? max : getValue({ min, max });

        return [isBlockVisible, getNewValue];
    };

    // <!-- Listeners  -->
    window.addEventListener('scroll', () => {
        const [isWelcomeBlock, getWelcomeValue] = getValueByPercent(welcomeBlockRect, { startFromTop: false });
        const [isAboutBlock, getAboutValue] = getValueByPercent(aboutBlockRect, {});

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

    }, { capture: true });

    WELCOME_BLOCK.addEventListener('mousemove', ({ clientY, clientX }) => {
        const { x, y } = welcomeFloatRect;
        WELCOME_FLOAT.style.transform = `translate3d(${x - clientX}px, ${y - clientY}px, 0px)`;
    });

    FLOAT_BUTTON.addEventListener('click', () => toggleSidebar());
    SIDEBAR_CLOSE.addEventListener('click', () => toggleSidebar());
    SIDEBAR.addEventListener('click', (e) => e.target === SIDEBAR && toggleSidebar());
});
