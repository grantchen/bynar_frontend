import React, { useState, useEffect } from 'react';
import jsonData from '../JSONs/usen.json';
import { ArrowRight } from "@carbon/react/icons";

import "./CustomSideNav.scss";

export function CustomSideNavMenu({ isShow }) {

  const [activeTitle, setActiveTitle] = useState(jsonData.mastheadNav.links[0]?.title);
  const handleClick = (title) => {
    setActiveTitle(title);
  };
  const [viewAllArray, setViewAllArray] = useState([])

  useEffect(() => {
    const filteredItems = jsonData.mastheadNav.links.flatMap((ele) => {
      if (ele.menuSections.length && ele.title === activeTitle) {
        return ele.menuSections[0]?.menuItems.filter((item) => item.megaPanelViewAll);
      }
      return [];
    });
    setViewAllArray(filteredItems);
  }, [activeTitle]);

  return (
    <>
      <div className={ `menu-body ${ isShow ? 'wide-menu-expanded' : '' }` }>
        <div className="mega-menu">
          <div className="bmegamenu-container">
            <div className="megamenu-container-row">
              <div className="left-navigation">
                <div className="categories">
                  <div className="tabs">
                    {
                      jsonData.mastheadNav.links.map((ele) => {
                        if (ele.menuSections.length) {
                          const isActive = activeTitle === ele.title;
                          return (
                            <>
                              <div
                                className={ `tab ${ isActive ? 'active' : '' }` }
                                key={ ele.title }
                                onClick={ () => handleClick(ele.title) }
                              >
                                <button>
                                  { ele.title }
                                </button>
                              </div>
                            </>
                          )
                        }
                        return null
                      })
                    }
                  </div>
                </div>

                {
                  viewAllArray?.length > 0 &&
                  <>
                    <div className="view-all">
                      <a className="bx--link" href={viewAllArray[0]?.url}>
                        <span>{ viewAllArray[0]?.title }</span>
                        <div className="bx--link__icon">
                          <ArrowRight />
                        </div>
                      </a>
                    </div>
                  </>
                }

              </div>

              <div className="right-navigation">
                <div className="tabpanel">
                  {
                    jsonData.mastheadNav.links.map((ele) => {
                      if (ele.menuSections.length && ele.title === activeTitle) {
                        return (
                          <>
                            <div className="panel-heading">
                              {
                                ele.url !== '' ? (
                                  <h2>
                                    <a href={ele.url} target="_blank">
                                      { ele.title }
                                      <ArrowRight size={ 20 } />
                                    </a>
                                  </h2>
                                ) : (
                                  <h2>{ ele.title } </h2>
                                )
                              }
                              <span>
                                { ele.description }
                              </span>
                            </div>
                            <div className="link-group">
                              {
                                ele.menuSections[0]?.menuItems.map((item) => {
                                  console.log(item, item)
                                  if (!item.megaPanelViewAll) {
                                    console.log(viewAllArray, 'bt');
                                    return (
                                      <div key={ item.title } className="link">
                                        <a href={ item.url } target="_blank" rel="noopener noreferrer">
                                          <div>
                                            <span>{ item.title }</span>
                                            <slot name="icon"></slot>
                                          </div>
                                          <span>{ item.megapanelContent?.description }</span>
                                        </a>
                                      </div>
                                    )
                                  }
                                })
                              }
                            </div>
                          </>
                        )
                      }
                      return null
                    })
                  }
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className={ `menu-overlay ${ isShow ? 'active' : '' }` }>
      </div>
    </>
  );

};

