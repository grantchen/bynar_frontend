import React, { useState } from 'react';
import { SidePanel } from '@carbon/ibm-products';
import { Button, TextInput } from 'carbon-components-react';
import './SidePanel.scss'
export const SidePanels = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="main--content">
            <Button onClick={() => setOpen(true)}>
                Open side panel
            </Button>
            {/* <SidePanel
                includeOverlay
                className="test"
                open={open}
                onRequestClose={() => setOpen(false)}
                title="Incident management"
                subtitle="Testing subtitle text."
                actions={[
                    {
                        label: 'Submit',
                        onClick: () => setOpen(false),
                        kind: 'primary',
                    },
                    {
                        label: 'Cancel',
                        onClick: () => setOpen(false),
                        kind: 'secondary',
                    },
                ]}
            >
                <div className={`story__body-content`}>
                    <h5>Subtitle</h5>
                    <div className={`story__text-inputs`}>
                        <TextInput
                            labelText="Input A"
                            id="side-panel-story-text-input-a"
                            className={`story__text-input`}
                        />
                        <TextInput
                            labelText="Input B"
                            id="side-panel-story-text-input-b"
                            className={`story__text-input`}
                        />
                    </div>
                </div>
            </SidePanel> */}
            <SidePanel
                includeOverlay
                className="test"
                open={open}
                onRequestClose={() => setOpen(false)}
                title="Incident management"
                subtitle="Testing subtitle text."
                actions={[
                    {
                        label: 'Submit',
                        onClick: () => setOpen(false),
                        kind: 'primary',
                    },
                    {
                        label: 'Cancel',
                        onClick: () => setOpen(false),
                        kind: 'secondary',
                    },
                ]}
            >
                <div>This is Test</div>
            </SidePanel>
        </div>
    )
}