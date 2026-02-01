'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PageAssemblyAnimation.module.css';

interface Skill {
    name: string;
    score: string;
}

interface PageAssemblyAnimationProps {
    jobTitle?: string;
    company?: string;
    location?: string;
    matchScore?: number;
    jobSummary?: string;
    responsibilities?: string[];
    qualifications?: string[];
    skills?: Skill[];
    missingSkills?: string[];
    suggestions?: string[];
    autoPlay?: boolean;
    playOnScroll?: boolean;
    onAnimationComplete?: () => void;
}

export default function PageAssemblyAnimationWithProps({
    jobTitle = "Principal Product Manager",
    company = "HomeToGo",
    location = "Germany",
    matchScore = 47,
    jobSummary = "In this role, you will own and shape the product that unlocks better stays for millions of travelers, shaping how HomeToGo evolves into an AI-driven OTA that helps users reach confident decisions and drives sustained retention.",
    responsibilities = [
        "Build discovery as a decision system.",
        "Make discovery adaptive to context and intent.",
        "Ensure end-to-end consistency and trust.",
        "Exercise judgment at scale."
    ],
    qualifications = ["10+ years of Product Management experience."],
    skills = [
        { name: "Product Management", score: "2/✓" },
        { name: "Discovery", score: "3/✓" },
        { name: "Influence", score: "1/✓" },
        { name: "Leadership", score: "1/✓" },
        { name: "Communication", score: "3/✓" }
    ],
    missingSkills = ["AI-driven OTA", "Search systems", "Ranking systems", "B2C marketplace"],
    suggestions = [
        "Include specific examples of experience with search or ranking systems to meet key job qualifications.",
        "Highlight any previous roles or projects that involved product management."
    ],
    autoPlay = true,
    playOnScroll = false,
    onAnimationComplete
}: PageAssemblyAnimationProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (playOnScroll && !autoPlay) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !isPlaying) {
                        setIsPlaying(true);
                    }
                },
                { threshold: 0.1 }
            );

            if (wrapperRef.current) {
                observer.observe(wrapperRef.current);
            }

            return () => observer.disconnect();
        }
    }, [playOnScroll, autoPlay, isPlaying]);

    useEffect(() => {
        if (isPlaying && onAnimationComplete) {
            const timer = setTimeout(() => {
                onAnimationComplete();
            }, 5600); // Total animation duration

            return () => clearTimeout(timer);
        }
    }, [isPlaying, onAnimationComplete]);

    // Calculate gauge angle based on match score
    const calculateStrokeDashoffset = (score: number) => {
        const totalDash = 251.2;
        const offset = totalDash - (totalDash * score) / 100;
        return offset;
    };

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${isPlaying ? styles.playing : ''}`}
        >
            {/* Rotating white screen */}
            {isPlaying && <div className={styles.whiteScreen}></div>}

            {/* Main content */}
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.headerBtn}>☰</button>
                    <button className={styles.headerBtn}>Dashboard</button>
                    <button className={styles.headerBtn}>🔗 Connect to LinkedIn</button>
                    <button className={styles.headerBtn}>📤 Upload Base CV</button>
                    <button className={styles.headerBtn}>✉️ Connect with Email</button>
                    <button className={styles.headerBtn}>📄 Resume Builder</button>
                    <button className={styles.headerBtn}>⬇️ Download extension</button>
                </div>

                {/* Main content area */}
                <div className={styles.mainContent}>
                    {/* Left section */}
                    <div className={styles.leftSection}>
                        <div className={styles.backBtn}>← Back to Jobs</div>

                        <h1 className={styles.jobTitle}>{jobTitle}</h1>
                        <div className={styles.companyInfo}>{company} • {location}</div>

                        <div className={`${styles.section} ${styles.section1}`}>
                            <h2 className={styles.sectionTitle}>Company Details</h2>
                        </div>

                        <div className={`${styles.section} ${styles.section2}`}>
                            <h2 className={styles.sectionTitle}>Job Details</h2>
                            <div className={styles.sectionContent}>
                                <h3>Job Summary</h3>
                                <p>{jobSummary}</p>

                                <h3>Key Responsibilities</h3>
                                <ul>
                                    {responsibilities.map((resp, idx) => (
                                        <li key={idx}>{resp}</li>
                                    ))}
                                </ul>

                                <h3>Required Qualifications</h3>
                                <ul>
                                    {qualifications.map((qual, idx) => (
                                        <li key={idx}>{qual}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className={styles.rightSection}>
                        <div className={styles.progressCard}>
                            <h2 className={styles.progressTitle}>Application Progress</h2>

                            <div className={styles.gaugeContainer}>
                                <svg className={styles.gauge} width="200" height="120" viewBox="0 0 200 120">
                                    <path className={styles.gaugeBg} d="M 20,100 A 80,80 0 0,1 180,100" />
                                    <path
                                        className={`${styles.gaugeFill} ${styles.gaugeRed}`}
                                        d="M 20,100 A 80,80 0 0,1 100,20"
                                        style={{
                                            '--final-offset': `${calculateStrokeDashoffset(matchScore)}px`
                                        } as React.CSSProperties}
                                    />
                                    <path
                                        className={`${styles.gaugeFill} ${styles.gaugeGreen}`}
                                        d="M 100,20 A 80,80 0 0,1 180,100"
                                        style={{
                                            '--final-offset': `${calculateStrokeDashoffset(matchScore)}px`
                                        } as React.CSSProperties}
                                    />
                                </svg>
                                <div className={styles.gaugeText}>{matchScore}%</div>
                            </div>

                            <div className={styles.matchLabel}>Match Score</div>
                            <div className={styles.matchScore}>{matchScore}%</div>

                            <div className={styles.skillsSection}>
                                <h3>Skill Analysis</h3>
                                <div className={styles.skillGrid}>
                                    {skills.map((skill, idx) => (
                                        <div key={idx} className={styles.skillItem}>
                                            <span>{skill.name}</span>
                                            <span>{skill.score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.skillsSection} ${styles.missingSection}`}>
                                <h3>Missing Skills</h3>
                                <div className={styles.badges}>
                                    {missingSkills.map((skill, idx) => (
                                        <span key={idx} className={styles.badge}>{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.suggestions}>
                                <h3>Suggested Improvements</h3>
                                <ul>
                                    {suggestions.map((suggestion, idx) => (
                                        <li key={idx}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}