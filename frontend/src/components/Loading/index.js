import React from 'react';
import { colors } from '../../styles';

export default function Loading() {
    return (
        <div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary}}>

            <div className="spinner-border text-light" role="status" style={{width: 80, height: 80}}>
                <span className="sr-only">Loading...</span>
            </div>

        </div>
    )
}