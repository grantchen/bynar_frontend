import React, { useState } from 'react';
import { Tearsheet } from '@carbon/ibm-products';
import { Button, Tabs, Tab } from 'carbon-components-react';

import './TearSheet.scss';

export const TearSheets = () => {
  const [isOpen, setIsOpen] = useState(true);
  const handleOpenModalClick = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>{`.exp-tearsheet { opacity: 0 };`}</style>
      <Button onClick={handleOpenModalClick}>Reopen Tearsheet</Button>
      <Tearsheet
        actions={[
          { kind: 'secondary', label: 'Cancel', onClick: handleCloseModal },
          { kind: 'primary', label: 'Create', onClick: handleCloseModal },
        ]}
        closeIconDescription="Close the tearsheet"
        description={
          // cspell:disable
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor <strong>incididunt ut labore</strong> et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.
          </span>
          // cspell:enable
        }
        influencer={
          <div className="tearsheet-example__dummy-content-block">
            Influencer
          </div>
        }
        label="This is the label of the tearsheet"
        navigation={
          <div className="tearsheet-example__tabs">
            <Tabs onSelectionChange={() => {}}>
              <Tab label="Tab 1" />
              <Tab label="Tab 2" />
              <Tab label="Tab 3" />
              <Tab label="Tab 4" />
            </Tabs>
          </div>
        }
        onClose={handleCloseModal}
        open={isOpen}
        preventCloseOnClickOutside
        title="This is the title of the tearsheet"
      >
        <div className="tearsheet-example__dummy-content-block">
          The main content of the Tearsheet should be placed here.
        </div>
      </Tearsheet>
    </>
  );
};


// import { Tearsheet ,TearsheetNarrow} from '@carbon/ibm-products';
// import { Button, Tabs, Tab ,FormGroup,Form,TextInput} from 'carbon-components-react';
// export const TearSheets =()=>{
//   return(
//     <>
//   <style>
//     {`.c4p--tearsheet { opacity: 0 };`}
//   </style>
//   <Button onClick={function noRefCheck(){}}>
//     Open Tearsheet
//   </Button>
//   <div
//     ref={{
//       current: '[Circular]'
//     }}
//   >
//     <TearsheetNarrow
//       actions={[]}
//       closeIconDescription="Close the tearsheet"
//       description="This is a description for the tearsheet, providing an opportunity to   describe the flow."
//       hasCloseIcon
//       label="The label of the tearsheet"
//       onClose={function noRefCheck(){}}
//       title="Title of the tearsheet"
//     >
//       <div className="tearsheet-stories__narrow-content-block">
//         <Form>
//           <p>
//             Main content
//           </p>
//           <FormGroup legendText="">
//             <TextInput
//               id="tss-ft1"
//               labelText="Enter an important value here"
//             />
//           </FormGroup>
//         </Form>
//       </div>
//     </TearsheetNarrow>
//   </div>
// </>
//   )
// }