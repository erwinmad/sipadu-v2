import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGSVGElement | HTMLImageElement>) {
    return (
        <img 
            src="/logo/sugih-mukti.png" 
            alt="Logo" 
            className={`object-contain ${props.className || ''}`}
        />
    );
}
