
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from 'react';

type CompletionPanelType = {
    title?: string,
    percentCompleted: number,
    className?: string,
    titleClass?: string
}

export function CompletionPanel({ title, className, titleClass, percentCompleted }: CompletionPanelType) {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primaryCC');

    return (
        <div className="flex items-center text-primary font-bold bg-panel px-5 py-2 rounded float-right w-200">
            <span>School Profile Completion</span>
            <span className="ml-5 text-2xl "> { percentCompleted }% </span>
            <div className="ml-5" style={{ width: 35, height: 35 }}>
                <CircularProgressbar
                    text={title}
                    strokeWidth={14}
                    value={percentCompleted}
                    styles={ buildStyles({
                        pathColor: `${primaryColor}`,
                        textColor: `${primaryColor}`,
                        textSize: '30px'})} />
            </div>
        </div>
    )
}
