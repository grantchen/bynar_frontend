import React from "react";
import { Tearsheet } from "@carbon/ibm-products";
import { UserList } from "./../UserList";
export const TearSheets = ({ setIsOpen, isOpen }) => {
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Tearsheet
        actions={[
          { kind: "secondary", label: "Close", onClick: handleCloseModal },
        ]}
        closeIconDescription="Close the tearsheet"
        label=""
        onClose={handleCloseModal}
        open={isOpen}
        preventCloseOnClickOutside
        title="User list"
      >
        {/* <div className="tearsheet"> */}
        <UserList isOpen={isOpen} />
        {/* </div> */}
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
