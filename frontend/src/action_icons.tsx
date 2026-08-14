import React, { type SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeColor?: string;
  fillColor?: string;
}

export const AddActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-268.12329,-50)">
    <circle cx="276.12332" cy="58" r="6.5" stroke={strokeColor} fill={fillColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 273.12332,58 h 6" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 276.12332,55 v 6" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const CloseActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-250.12329,-50)">
    <circle cx="258.12332" cy="58" r="6.5" stroke={strokeColor} fill={fillColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 255.51546,55.392135 5.21573,5.215731" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 255.51546,60.607866 5.21573,-5.215731" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const CopyActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-304,-50)">
    <rect width="10" height="10" x="305.75" y="54.25" rx="2" ry="2" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <rect width="10" height="10" x="308.25" y="51.75" rx="2" ry="2" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 311.36931,56.57734 h 4" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 313.36931,54.57734 v 4" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const DeleteActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-322,-50)">
    <rect width="8.9999981" height="10.48631" x="325.47791" y="53.773438" rx="1" ry="1" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 324,53.773437 h 12" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 328,53.646447 c 0,-1.444628 0,-2.143632 2,-2.132583 2,0.01105 2,0.659097 2,2.132583" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 328,61 4,-4" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 328,57 4,4" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const DownActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-376.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const EditActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-286,-50)">
    <path d="m 298.5,51.5 -10,10 -1,3 3,-1 10,-10 z" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 297,53 2,2" stroke={strokeColor} fill={fillColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const EllipsisActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-358,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const EllipsisDownActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-448.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const InfoActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-214.12329,-50)">
    <circle cx="222.12332" cy="58" r="6.5" stroke={strokeColor} fill={fillColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 222.12332,57.421875 c 0,4 0,4 0,4" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <circle cx="222.12332" cy="54.75" r="0.75" stroke={strokeColor} fill={strokeColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const LeftActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-412.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const MenuActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-466.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const PlusActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-340,-50)">
    <path d="m 343.50823,58 h 8.93934" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 348,53.707107 v 8.674175" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const RightActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-430.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const UpActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-394.12329,-50)">
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            
export const XActionIcon: React.FC<IconProps> = ({
            size = 16,
            strokeColor = 'currentColor',
            fillColor = 'none',
            className = '',
            ...props
            }) => (
            <svg className={className} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
  <g transform="translate(-232.12329,-50)">
    <path d="m 236.12332,54 8,8" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <path d="m 236.12332,62 8,-8" stroke={strokeColor} fill={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    <g mask="none" transform="translate(-1.68e-5,7.000013)">
      <path d="M 2.0000336,54.999974 12,55" fill={fillColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m 2,54 c -0.5522847,5e-6 -1,0.447715 -1,1 0,0.552285 0.4477153,1.000005 1,1 l 2.207031,-1.8e-5 c 1.290024,-1.1e-5 0.704206,0.13393 0.714106,-1 0.0099,-1.13393 0.563195,-1.000011 -0.714106,-1 z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="362.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="366.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="370.00003" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 379.12334,48.999987 5,5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 397.12334,52.999987 5,-5 5,5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 422.12334,55.999987 -5,-5 5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 436.12334,55.999987 5,-5 -5,-5" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="46.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="50.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx="456.12335" cy="54.999989" r="1" fill={fillColor} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,46.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,50.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <path d="m 469.12334,54.999987 h 10" stroke={strokeColor} fill={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
    </g>
  </g>
</svg>
            );
            