import React, {useCallback, useEffect, useState} from "react";
import {Column, Grid, Header, HeaderName, Link,} from "@carbon/react";
import {ArrowRight} from "@carbon/react/icons";
import ibmLogo from "../../components/media/IBM_logo_black.svg";
import backgroundImage from '../../components/media/background.svg';
import "../Home2/home2.scss";
import "../../pages/signin/signin.scss";
import {
    forEach
} from "@carbon/ibmdotcom-web-components/es/internal/vendor/@carbon/web-components/globals/internal/collection-helpers";

const Home = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoBackgroundColor, setVideoBackgroundColor] = useState("white");

    const handleShowVideo = useCallback(() => {
        setShowVideo(true);
        setVideoBackgroundColor("black");
    }, []);
    useEffect(() => {
        // Animation code here
        const animationDelay = 2500;
        const barAnimationDelay = 3800;
        const barWaiting = barAnimationDelay - 3000;
        const lettersDelay = 50;
        const typeLettersDelay = 150;
        const selectionDuration = 500;
        const typeAnimationDelay = selectionDuration + 800;
        const revealDuration = 600;
        const revealAnimationDelay = 1500;
        function initHeadline() {
            const words = document.querySelectorAll('.cd-words-wrapper b');
            singleLetters(words);
            //initialise headline animation
            const headline = document.querySelectorAll('.cd-headline');
            animateHeadline(headline);
        }
        function singleLetters(wordElements) {
            wordElements.forEach((wordElement) => {
                const word = wordElement;
                console.log(word)
                const letters = word.textContent.split('');
                const selected = word.classList.contains('is-visible');
                const newLetters = letters.map((letter) => {
                    if (word.closest('.rotate-2')) {
                        return `<em>${letter}</em>`;
                    }
                    return selected ? `<i class="in">${letter}</i>` : `<i>${letter}</i>`;
                }).join('');
                word.innerHTML = newLetters;
                word.style.opacity = 1;
            });
        }

        function animateHeadline(headlines) {
            var duration = animationDelay;
            headlines.forEach(headline => {
                if (headline.classList.contains('loading-bar')) {
                    duration = barAnimationDelay;
                    setTimeout(() => {
                        const wordsWrapper = headline.querySelector('.cd-words-wrapper');
                        wordsWrapper.classList.add('is-loading');
                    }, barWaiting);
                } else if (headline.classList.contains('clip')) {
                    const spanWrapper = headline.querySelector('.cd-words-wrapper');
                    const newWidth = spanWrapper.offsetWidth + 10;
                    spanWrapper.style.width = newWidth + 'px';
                } else if (!headline.classList.contains('type')) {
                    const words = headline.querySelectorAll('.cd-words-wrapper b');
                    let width = 0;
                    words.forEach(word => {
                        const wordWidth = word.offsetWidth;
                        if (wordWidth > width) width = wordWidth;
                    });
                    const wordsWrapper = headline.querySelector('.cd-words-wrapper');
                    wordsWrapper.style.width = width + 'px';
                }

                //trigger animation
                setTimeout(() => {
                    const visibleWord = headline.querySelector('.is-visible');
                    hideWord(visibleWord);
                }, duration);
            });
        }


        function hideWord(word) {
            var nextWord = takeNext(word);

            if (word.parents('.cd-headline').hasClass('type')) {
                var parentSpan = word.parent('.cd-words-wrapper');
                parentSpan.addClass('selected').removeClass('waiting');
                setTimeout(function() {
                    parentSpan.removeClass('selected');
                    word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
                }, selectionDuration);
                setTimeout(function() {
                    showWord(nextWord, typeLettersDelay)
                }, typeAnimationDelay);

            } else if (word.parents('.cd-headline').hasClass('letters')) {
                var bool = (word.children('i').length >= nextWord.children('i').length) ? true : false;
                hideLetter(word.find('i').eq(0), word, bool, lettersDelay);
                showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

            } else if (word.parents('.cd-headline').hasClass('clip')) {
                word.parents('.cd-words-wrapper').animate({
                    width: '2px'
                }, revealDuration, function() {
                    switchWord(word, nextWord);
                    showWord(nextWord);
                });

            } else if (word.parents('.cd-headline').hasClass('loading-bar')) {
                word.parents('.cd-words-wrapper').removeClass('is-loading');
                switchWord(word, nextWord);
                setTimeout(function() {
                    hideWord(nextWord)
                }, barAnimationDelay);
                setTimeout(function() {
                    word.parents('.cd-words-wrapper').addClass('is-loading')
                }, barWaiting);

            } else {
                switchWord(word, nextWord);
                setTimeout(function() {
                    hideWord(nextWord)
                }, animationDelay);
            }
        }

        function showWord(word, duration) {
            if (word.parents('.cd-headline').hasClass('type')) {
                showLetter(word.find('i').eq(0), word, false, duration);
                word.addClass('is-visible').removeClass('is-hidden');

            } else if (word.parents('.cd-headline').hasClass('clip')) {
                word.parents('.cd-words-wrapper').animate({
                    'width': word.width() + 10
                }, revealDuration, function() {
                    setTimeout(function() {
                        hideWord(word)
                    }, revealAnimationDelay);
                });
            }
        }

        function hideLetter(letter, word, bool, duration) {
            letter.removeClass('in').addClass('out');

            if (!letter.is(':last-child')) {
                setTimeout(function() {
                    hideLetter(letter.next(), word, bool, duration);
                }, duration);
            } else if (bool) {
                setTimeout(function() {
                    hideWord(takeNext(word))
                }, animationDelay);
            }

            if (letter.is(':last-child') && ('html').hasClass('no-csstransitions')) {
                var nextWord = takeNext(word);
                switchWord(word, nextWord);
            }
        }

        function showLetter(letter, word, bool, duration) {
            letter.addClass('in').removeClass('out');

            if (!letter.is(':last-child')) {
                setTimeout(function() {
                    showLetter(letter.next(), word, bool, duration);
                }, duration);
            } else {
                if (word.parents('.cd-headline').hasClass('type')) {
                    setTimeout(function() {
                        word.parents('.cd-words-wrapper').addClass('waiting');
                    }, 200);
                }
                if (!bool) {
                    setTimeout(function() {
                        hideWord(word)
                    }, animationDelay)
                }
            }
        }

        function takeNext(word) {
            return word
            // return (!word.is(':last-child')) ? word.next() : word.parent().children().eq(0);
        }

        function takePrev(word) {
            return (!word.is(':first-child')) ? word.prev() : word.parent().children().last();
        }

        function switchWord(oldWord, newWord) {
            oldWord.removeClass('is-visible').addClass('is-hidden');
            newWord.removeClass('is-hidden').addClass('is-visible');
        }
        // More functions here...

        initHeadline();
    }, []);
    return (
        <div>
            <Header>
                <HeaderName href="/" prefix="">
                    <img src={ibmLogo} style={{marginLeft: 1 + "rem"}} />
                </HeaderName>
            </Header>
            <div
                className={"auth-login-container"}
            >
                <Grid className={".auth-login-grid"}>
                    <Column sm={7} md={14} lg={10} className={".auth-login-column"} style={{
                        backgroundImage: `url({backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                    <div className="header-caption" id="page-top">
                        <h3 className="cd-headline clip is-full-width">
                            <span>I'm </span>
                            <span className="cd-words-wrapper">
                              <b className="is-visible">SuperCool</b>
                              <b className="is-hidden"> a Professional coder</b>
                              <b className="is-hidden">a Developer</b>
                            </span>
                            <span>.</span>
                        </h3>
                    </div>
                    </Column>

                    <Column sm={5} md={10} lg={6}>
                        <div style={{marginTop: 7 + "rem"}}>
                            <div className="bx--row">
                                <div className="bx--col">
                                    <div className="field-container bottom-container">
                                        <div className="register-text body-01">
                                            <div>
                                                <Link
                                                    renderIcon={ArrowRight}
                                                    className="login-create-account bx--btn bx--btn--tertiary"
                                                    href={`/signup`}
                                                >
                                                    {" "}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bx--col">
                                    <div className="field-container bottom-container">
                                        <div className="register-text body-01">
                                            <div>
                                                <Link
                                                    renderIcon={ArrowRight}
                                                    className="login-create-account bx--btn bx--btn--tertiary"
                                                    href={`/signin`}
                                                >
                                                    {" "}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="footer">
                            <div className="footer-content">
                                <a href="#">Privacy Policy</a>
                                <div className="footer_link_divider">|</div>
                                <a href="#">Terms of Use</a>
                                <div className="footer_link_divider">|</div>
                                <a href="#">Cookie Preferences</a>
                            </div>
                            <div className="footer_copy_right">Bynar, Inc. or its affiliates. All rights reserved.</div>
                        </footer>
                    </Column>
                </Grid>
            </div>
        </div>
    )
}
export default Home;
