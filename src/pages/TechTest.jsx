import React from 'react';
import TechnicalAssessmentWidget from '../components/TAWidget';

export default function Tech_Test() {
    return (
        <div style={{ padding:24}}>
            <h1>Tech Assessment Test Page</h1>
            <p>If you can see the widget below, then the rendering is working</p>

            <TechnicalAssessmentWidget />
            <div style={{ marginTop: 24, opacity: 0.8 }}>
                Note: If data does not load, check devtools + network for <code>/api/technical_assessment</code>
            </div>
        </div>
    )
}
