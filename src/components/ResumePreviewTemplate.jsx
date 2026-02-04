import React, { forwardRef } from 'react';

const ResumePreviewTemplate = forwardRef(({ data, settings = {}, isEditable = false }, ref) => {
    if (!data) return null;

    const { 
        fontFamily = 'font-serif', 
        fontSize = 'text-sm', 
        accentColor = '#1f2937', 
        lineHeight = 'leading-relaxed',
        textAlign = 'text-left'
    } = settings;

    const { basics, work, education, skills, projects } = data;

    const headerStyle = { color: accentColor };
    const borderStyle = { borderColor: accentColor };

    return (
        <div 
            ref={ref} 
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            className={`bg-[#ffffff] text-[#000000] p-5 md:p-10 min-h-[60vh] md:min-h-[1056px] w-full max-w-[816px] mx-auto shadow-2xl ${fontSize} ${fontFamily} ${lineHeight} ${textAlign} relative outline-none`}
        >
            {/* Header */}
            {basics && (
                <div className="border-b-2 pb-4 mb-6" style={borderStyle}>
                    <h1 className="text-3xl font-bold uppercase tracking-wide" style={headerStyle}>{basics.name}</h1>
                    <div className="text-[#4b5563] mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-wider">
                        {basics.email && <span>{basics.email}</span>}
                        {basics.phone && <span>• {basics.phone}</span>}
                        {basics.location?.city && <span>• {basics.location.city}, {basics.location.region}</span>}
                        {basics.url && <span>• {basics.url}</span>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {basics?.summary && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ ...headerStyle, ...borderStyle }}>Professional Summary</h3>
                    <p className="text-[#374151]">{basics.summary}</p>
                </div>
            )}

            {/* Experience */}
            {work && work.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ ...headerStyle, ...borderStyle }}>Experience</h3>
                    <div className="space-y-4">
                        {work.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-[#1f2937]">{item.position}</h4>
                                    <span className="text-xs font-semibold text-[#6b7280] whitespace-nowrap">
                                        {item.startDate} – {item.endDate || 'Present'}
                                    </span>
                                </div>
                                <div className="text-xs font-semibold uppercase mb-1" style={{ color: accentColor }}>{item.company}</div>
                                {item.summary && <p className="text-[#374151] mb-2">{item.summary}</p>}
                                {item.highlights && (
                                    <ul className="list-disc list-outside ml-4 text-[#374151] space-y-1">
                                        {item.highlights.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ ...headerStyle, ...borderStyle }}>Education</h3>
                    <div className="space-y-3">
                        {education.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-[#1f2937]">{item.institution}</h4>
                                    <span className="text-xs font-semibold text-[#6b7280]">
                                        {item.startDate} – {item.endDate || 'Present'}
                                    </span>
                                </div>
                                <div className="text-[#374151]">
                                    {item.studyType} in {item.area}
                                    {item.score && <span> (GPA: {item.score})</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ ...headerStyle, ...borderStyle }}>Skills</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                         {skills.map((item, index) => (
                             <div key={index} className="flex flex-col">
                                 <span className="font-bold text-xs uppercase" style={{ color: accentColor }}>{item.name}</span>
                                 <span className="text-[#4b5563] text-xs">
                                     {item.keywords?.join(', ')}
                                 </span>
                             </div>
                         ))}
                    </div>
                </div>
            )}

             {/* Projects */}
             {projects && projects.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ ...headerStyle, ...borderStyle }}>Projects</h3>
                    <div className="space-y-3">
                        {projects.map((item, index) => (
                            <div key={index}>
                                <h4 className="font-bold text-[#1f2937] flex items-center gap-2">
                                    {item.name}
                                    {item.url && <a href={item.url} target="_blank" className="hover:underline text-xs font-normal opacity-70" style={{ color: accentColor }}>link</a>}
                                </h4>
                                <p className="text-[#374151]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default ResumePreviewTemplate;
