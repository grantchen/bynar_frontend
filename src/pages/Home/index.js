import '@carbon/ibmdotcom-web-components/es/components/button-group/index.js';
import '@carbon/ibmdotcom-web-components/es/components/dotcom-shell/index.js';
import '@carbon/ibmdotcom-web-components/es/components/leadspace-with-search/index.js';
import '@carbon/ibmdotcom-web-components/es/components/table-of-contents/index.js';
import '@carbon/ibmdotcom-web-components/es/components/card-section-offset/index.js';
import '@carbon/ibmdotcom-web-components/es/components/cta-section/index.js';
import '@carbon/ibmdotcom-web-components/es/components/link-list/index.js';
import '@carbon/ibmdotcom-web-components/es/components/content-section/index.js';
import '@carbon/ibmdotcom-web-components/es/components/content-block/index.js';
import '@carbon/ibmdotcom-web-components/es/components/content-group/index.js';
import '@carbon/ibmdotcom-web-components/es/components/card-group/index.js';
import '@carbon/ibmdotcom-web-components/es/components/image/index.js';
import '@carbon/ibmdotcom-web-components/es/components/card-in-card/index.js';
import '@carbon/ibmdotcom-web-components/es/components/cta/video-cta-container.js';
import '@carbon/ibmdotcom-web-components/es/components/cta/index.js';
import '@carbon/ibmdotcom-web-components/es/components/content-item/index.js';
import '@carbon/ibmdotcom-web-components/es/components/image-with-caption/index.js';
import '@carbon/ibmdotcom-web-components/es/components/cta/link-list-item-card-cta.js';
import 'carbon-web-components/es/components/tag/tag';
import 'carbon-web-components/es/components/tabs/index';
// import 'carbon-web-components/es/components/data-table/index';
import 'carbon-web-components/es/components/radio-button/index';
import 'carbon-web-components/es/components/structured-list/index';

const Home = () => {
  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <dds-dotcom-shell-container>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col-lg-8 bx--offset-lg-4 bx--no-gutter">
              <dds-leadspace-with-search adjacent-theme="g90-and-g100">
                <dds-leadspace-block-heading slot="heading">Find analytics services</dds-leadspace-block-heading>
                <dds-leadspace-block-content slot="content">
                  <dds-leadspace-search-block-heading style={{color:'#F4F4F4',fontSize:'44px'}}>Make fast and accurate data-based
                    decisions</dds-leadspace-search-block-heading>
                </dds-leadspace-block-content>
                <dds-search-with-typeahead
                  slot="search"
                  leadspace-search></dds-search-with-typeahead>
              </dds-leadspace-with-search>
            </div>
          </div>
        </div>
        <dds-table-of-contents toc-layout="horizontal" stickyOffset="48" >
          <a name="1" id="1" data-title="Smarter decisions"></a>
          <dds-content-section >
            <dds-content-section-heading>Smarter decisions</dds-content-section-heading>
            <dds-content-block complementary-style-scheme="with-border">
              <dds-content-block-heading>Always make smarter decisions with Analytics</dds-content-block-heading>
              <dds-content-block-copy>Analytics services on the IBM Cloud can be deployed in the cloud, on premises or in a hybrid environment. IBM Cloud solutions, featuring embedded intelligence capabilities through machine learning (ML), enable you to easily analyze the data and build ML models that can be deployed in cognitive applications. Combine these services to reveal insights.</dds-content-block-copy>

              <dds-content-group>
                <dds-content-group-heading>Analytics services</dds-content-group-heading>
                <dds-content-group-copy>Work together in a simpler way to find new and unexpected insights quickly and deliver business-changing results with state-of-the-art services.</dds-content-group-copy>

                <dds-card-group>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/analytics-services-card1.png"></dds-image>
                    <dds-card-eyebrow>Apache Spark and Hadoop service</dds-card-eyebrow>
                    <dds-card-heading>IBM® Analytics Engine</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/analytics-services-card2.png"></dds-image>
                    <dds-card-eyebrow>Cluster computing framework</dds-card-eyebrow>
                    <dds-card-heading>Apache Spark</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/analytics-services-card3.png"></dds-image>
                    <dds-card-eyebrow>IBM Cloud</dds-card-eyebrow>
                    <dds-card-heading>IBM Information Server on Cloud®</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/analytics-services-card4.png"></dds-image>
                    <dds-card-eyebrow>Data trust service</dds-card-eyebrow>
                    <dds-card-heading>IBM® Master Data Management on Cloud</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/analytics-services-card5.png"></dds-image>
                    <dds-card-eyebrow>Data range analysis</dds-card-eyebrow>
                    <dds-card-heading>IBM® Streaming Analytics</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                </dds-card-group>
              </dds-content-group>
            </dds-content-block>
          </dds-content-section>
          <a name="2" id="2" data-title="Success Stories"></a>
          <dds-content-section >
            <dds-content-section-heading>Success stories</dds-content-section-heading>
            <dds-content-block>
              <dds-content-block-heading>Customer story: Emory University Hospital</dds-content-block-heading>
              <dds-video-cta-container>
                <dds-card-in-card video-name="Gaining life saving insight 95% faster in the ICU" href="0_3v0uyp0b" cta-type="video">
                  <dds-card-eyebrow>Emory University Hospital</dds-card-eyebrow>
                  <dds-card-cta-footer cta-type="video" href="0_3v0uyp0b"></dds-card-cta-footer>
                </dds-card-in-card>
              </dds-video-cta-container>
              <dds-content-group>
                <dds-content-group-heading>More customer stories</dds-content-group-heading>
                <dds-card-group>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/client-story-card1.jpg"></dds-image>
                    <dds-card-eyebrow>IBM Watson Discovery</dds-card-eyebrow>
                    <dds-card-heading>Citi Bank transforms internal audit practice</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/client-story-card2.jpg"></dds-image>
                    <dds-card-eyebrow>IBM Cloud Pak</dds-card-eyebrow>
                    <dds-card-heading>ING carries out data fabric vision</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                  <dds-card-group-item cta-type='local' href='https://example.com'>
                    <dds-image slot="image" alt="Image alt text" default-src="./assets/images/client-story-card3.jpg"></dds-image>
                    <dds-card-eyebrow>IBM Cloud Pak for Data</dds-card-eyebrow>
                    <dds-card-heading>Innocence tackles neonate mortality rates with AI</dds-card-heading>
                    <dds-card-cta-footer cta-type='local'>
                    </dds-card-cta-footer>
                  </dds-card-group-item>
                </dds-card-group>
              </dds-content-group>
              <dds-card-link-cta slot="footer" cta-type="local" href="https://www.example.com">
                <dds-card-link-heading>Register for a free trial of IBM Analytics Engine</dds-card-link-heading>
                <dds-card-cta-footer></dds-card-cta-footer>
              </dds-card-link-cta>
            </dds-content-block>
          </dds-content-section>
          <a name="3" id="3" data-title="Main benefits of analytics"></a>
          <dds-card-section-offset >
            <dds-background-media
              gradient-direction="left-to-right"
              mobile-position="top"
              alt="alt text"
              default-src="./assets/images/card-section-offset.jpg">
              <dds-image-item
                media="(min-width: 620px)"
                srcset="./assets/images/card-section-offset.jpg">
              </dds-image-item>
              <dds-image-item
                media="(min-width: 619px)"
                srcset="./assets/images/card-section-offset--sm.jpg">
              </dds-image-item>
            </dds-background-media>
            <dds-content-block-heading slot="heading">A quick look at the main benefits of
              analytics
            </dds-content-block-heading>
            <dds-text-cta
              slot="action"
              cta-type="local"
              icon-placement="right"
              href="https://example.com">
              See the full range of benefits
            </dds-text-cta>
            <dds-card-group slot="card-group" cards-per-row="2">
              <dds-card-group-item empty></dds-card-group-item>
              <dds-card-group-item cta-type="local" href="https://example.com">
                <dds-card-eyebrow>Collaboration</dds-card-eyebrow>
                <dds-card-heading
                >Connect teams across functions</dds-card-heading
                >
                <p>
                  Collaborate in teams across functions to access all trusted data
                  and best-in- className technologies.
                </p>
                <dds-card-cta-footer slot="footer"> </dds-card-cta-footer>
              </dds-card-group-item>
              <dds-card-group-item cta-type="local" href="https://example.com">
                <dds-card-eyebrow>Innovation</dds-card-eyebrow>
                <dds-card-heading
                >Discover new insights from data</dds-card-heading
                >
                <p>
                  Use multiple analytics technologies to learn from data and
                  quickly get new answers for your business.
                </p>
                <dds-card-cta-footer slot="footer"> </dds-card-cta-footer>
              </dds-card-group-item>
              <dds-card-group-item cta-type="local" href="https://example.com">
                <dds-card-eyebrow>Fast delivery</dds-card-eyebrow>
                <dds-card-heading
                >Accelerate delivery of insights</dds-card-heading
                >
                <p>
                  Deliver new insights to your business quickly, and
                  continuously improve them through rapid iteration.
                </p>
                <dds-card-cta-footer slot="footer"> </dds-card-cta-footer>
              </dds-card-group-item>
            </dds-card-group>
          </dds-card-section-offset>
          <a name="4" id="4" data-title="IBM Analytics Engine"></a>
          <dds-content-section >
            <dds-content-section-heading>Under the hood</dds-content-section-heading>
            <dds-content-block>
              <dds-content-block-heading>IBM Analytics Engine</dds-content-block-heading>
              <dds-content-block-copy>IBM Analytics Engine provides an architecture for Hadoop clusters that decouples the compute and storage tiers. Instead of a permanent cluster formed of dual-purpose nodes, the Analytics Engine allows users to store data in an object storage layer such as IBM Cloud Object Storage and spins up clusters of compute notes when needed. Separating compute from storage helps to transform the flexibility, scalability and maintainability of big data analytics platforms.  </dds-content-block-copy>

              <dds-content-group>
                <dds-content-group-heading>IBM Analytics Engine features</dds-content-group-heading>
                <dds-content-group-copy>A single Hadoop and Spark service providing an environment to develop and deploy advanced analytics applications in minutes.</dds-content-group-copy>
                <dds-content-item>
                  <dds-content-item-heading>Leverage open source power</dds-content-item-heading>
                  <dds-content-item-copy>Build on an ODPi compliant stack with pioneering data science tools with the broader Apache Hadoop and Apache Spark ecosystem.</dds-content-item-copy>
                </dds-content-item>
                <dds-content-item>
                  <dds-content-item-heading>Spin up and scale on demand</dds-content-item-heading>
                  <dds-image-with-caption
                    default-src="./assets/images/ibm-analytics-engine-img.png"
                    heading="Graphical depiction of analytics clusters"
                    copy="lorum ipsum"
                    lightbox
                  ></dds-image-with-caption>
                  <dds-content-item-copy>Define clusters based on your application's requirement. Choose the appropriate software pack, version, and size of the cluster. Use as long as required and delete as soon as application finishes jobs.</dds-content-item-copy>
                  <dds-text-cta slot="footer" cta-type="local" href="https://www.example.com">Learn more about NLP</dds-text-cta>
                </dds-content-item>
                <dds-content-item>
                  <dds-content-item-heading>Configure the environment</dds-content-item-heading>
                  <dds-content-item-copy>Configure clusters with third-party analytics libraries and packages. Deploy workloads from IBM Cloud services like machine learning.</dds-content-item-copy>
                  <dds-text-cta slot="footer" cta-type="local" href="https://www.example.com">Read more about Engine configuration</dds-text-cta>
                </dds-content-item>
                <dds-card-link-cta slot="footer" cta-type="local" href="https://www.example.com">
                  <dds-card-link-heading>Register for a free trial of IBM Analytics Engine</dds-card-link-heading>
                  <dds-card-cta-footer></dds-card-cta-footer>
                </dds-card-link-cta>
              </dds-content-group>

              <dds-link-list type="default" slot='complementary'>
                <dds-link-list-heading>Related products</dds-link-list-heading>
                <dds-link-list-item-card-cta
                  href="https://www.exmaple.com"
                  cta-type="local"
                >
                  <p>IBM Watson</p>
                  <dds-card-cta-footer></dds-card-cta-footer>
                </dds-link-list-item-card-cta>
                <dds-link-list-item-card-cta
                  href="https://www.exmaple.com"
                  cta-type="local"
                >
                  <p>Take a drive with IBM Watson Studio</p>
                  <dds-card-cta-footer></dds-card-cta-footer>
                </dds-link-list-item-card-cta>
                <dds-link-list-item-card-cta
                  href="https://www.exmaple.com"
                  cta-type="local"
                >
                  <p>IBM Watson Knowledge Catalog</p>
                  <dds-card-cta-footer></dds-card-cta-footer>
                </dds-link-list-item-card-cta>
              </dds-link-list>
            </dds-content-block>
          </dds-content-section>
          <a name="5" id="5" data-title="Engage an expert"></a>
          <div className="dark-theme" >
            <dds-cta-section>
              <dds-content-section-heading slot="heading">Take the next step</dds-content-section-heading>
              <dds-cta-block no-border>
                <dds-content-block-heading>Engage an expert</dds-content-block-heading>
                <dds-content-block-copy>Schedule a one-on-one, no-cost consultation with experts to
                  accelerate your integration of analytics services.
                </dds-content-block-copy>
                <dds-text-cta
                  slot="action"
                  cta-type="local"
                  icon-placement="right"
                  href="example.com"
                >Book a consultation</dds-text-cta>
                <dds-link-list slot="link-list" type="end">
                  <dds-link-list-heading>More ways to explore IBM analytics services
                  </dds-link-list-heading>
                  <dds-link-list-item href="https://example.com">
                    Events
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                  <dds-link-list-item href="https://example.com">
                    Blogs
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                  <dds-link-list-item href="https://example.com">
                    Training
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                  <dds-link-list-item href="https://example.com">
                    Developer resources
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                  <dds-link-list-item href="https://example.com">
                    Research
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                  <dds-link-list-item href="https://example.com">
                    News
                    <svg
                      slot="icon"
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20">
                      <path d="M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z"></path>
                    </svg>
                  </dds-link-list-item>
                </dds-link-list>
              </dds-cta-block>
            </dds-cta-section>
          </div>
        </dds-table-of-contents>
      </dds-dotcom-shell-container>
    </div>
  )
}
export default Home;
