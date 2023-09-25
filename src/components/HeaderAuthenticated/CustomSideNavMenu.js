import React, { useState, useEffect } from 'react';
import {
    Link
  } from "@carbon/react";
import jsonData from '../JSONs/usen.json';
import { ArrowRight, ArrowLeft } from "@carbon/react/icons";

import "./CustomSideNav.scss";

export function CustomSideNavMenu({isShow}) {

    const [activeTitle, setActiveTitle] = useState(jsonData.mastheadNav.links[0]?.title);
    const handleClick = (title) => {
        setActiveTitle(title);
    };
    const [viewAllArray, setViewAllArray] = useState([])

    useEffect(() => {
        const filteredItems = jsonData.mastheadNav.links.flatMap((ele) => {
            console.log(ele,"sAS");
            if (ele.menuSections.length && ele.title === activeTitle) {
                return ele.menuSections[0]?.menuItems.filter((item) => item.megaPanelViewAll);
            }
            return [];
        });
        setViewAllArray(filteredItems);
    }, [activeTitle]);

    return (
        <div className={`flex-container-desc ${isShow ? 'wide-menu-expanded' : ''}`}>
            <div className="head-title" style={{ textAlign: 'left' }}>
                {
                    jsonData.mastheadNav.links.map((ele) => {
                        if (ele.menuSections.length) {
                            const isActive = activeTitle === ele.title;
                            return (
                                <>
                                    <div
                                        className={`single-title ${isActive ? 'active' : ''}`}
                                        key={ele.title}
                                        onClick={() => handleClick(ele.title)}
                                    >
                                        <p
                                            key={ele.title}
                                            className={activeTitle === ele.title ? 'active' : ''}
                                            onClick={() => handleClick(ele.title)}
                                        >
                                            {ele.title}
                                        </p>
                                    </div>
                                </>
                            )
                        }
                        return null
                    })
                }
                {
                    viewAllArray?.length > 0 &&
                    <>
                        <div className="title-separator"></div>
                        <div className='view-all-array'>
                            <Link href={viewAllArray[0]?.url} renderIcon={ArrowRight}>{viewAllArray[0]?.title}</Link>
                        </div>
                    </>
                }
            </div>
            <div className="menu-description" style={{ textAlign: 'left' }}>
                {
                    jsonData.mastheadNav.links.map((ele) => {
                        if (ele.menuSections.length && ele.title === activeTitle) {
                            return (
                                <div key={ele.title}>
                                    {
                                      ele.url !== '' ? (

                                        <a> <h4 className="sub-menu-description">{ele.title}</h4> <ArrowRight size={28} /></a>
                                      ) : (
                                        <h4 className="sub-menu-description">{ele.title} </h4>
                                      )
                                    }
                                    <p className="menu-description">{ele.description}</p>
                                    <div className="grid-container">
                                        {
                                            ele.menuSections[0]?.menuItems.map((item) => {
                                                console.log(item, item)
                                                if (!item.megaPanelViewAll) {
                                                    console.log(viewAllArray, 'bt');
                                                    return (
                                                        <div key={item.title} className="grid-item">
                                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                                <h5>{item.title}</h5>
                                                                <p>{item.megapanelContent?.description}</p>
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                        return null
                    })
                }
            </div>
        </div>
    );

};

