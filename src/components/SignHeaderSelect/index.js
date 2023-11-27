import React, {useState} from 'react';
import {Dropdown, Header, HeaderName} from '@carbon/react';
import {Languages} from "../../sdk";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import "./SideHeader.scss";
import bynarLogo from '../media/bynarLogo.svg';
import bynarLogoDarkMode from '../media/bynarLogoDarkMode.svg';

const SignHeaderSelect = ({ onLanguageChange }) => {
    const [language, setLanguage] = useState(localStorage.getItem('lang') ?? "en");
    const languagesItems = Languages.map((languageObject) => languageObject.code);
    const { t } = useTranslation();

    // after Change Language, set to localStorage
    const handleLanguageChange = (selectedLanguage) => {
        localStorage.clear();
        const selectedItem = Languages.find((item) => item.code === selectedLanguage.selectedItem);
        if (Object.keys(selectedItem).length === 0) {
            setLanguage('en');
            localStorage.setItem('lang', 'en')
            i18n.changeLanguage('en');
            onLanguageChange('en');
        } else {
            setLanguage(selectedLanguage.selectedItem);
            localStorage.setItem('lang', selectedLanguage.selectedItem)
            i18n.changeLanguage(selectedLanguage.selectedItem);
            onLanguageChange(selectedLanguage.selectedItem);
        }
    };
    return (
        <Header aria-label="Bynar">
            <HeaderName href="/" prefix="" className="header-name">
                <img src={bynarLogo} alt="ibm_logo"/>
            </HeaderName>
            <div className="header-right">
                <Dropdown
                    id="default"
                    type="inline"
                    initialSelectedItem={language}
                    items={languagesItems}
                    selectedItem={language}
                    itemToString={(item) => (item ? t(item) : '')}
                    onChange={(selectedItem) => handleLanguageChange(selectedItem)}
                    label={''}
                />
            </div>
        </Header>
    );
};

export default SignHeaderSelect;
