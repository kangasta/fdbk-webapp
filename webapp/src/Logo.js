import React, { Component } from 'react';

import './Logo.css';

class Logo extends Component {
	render() {
		return (
			<svg className="Logo" viewBox="0 0 512 512">
				<defs>
					<mask id="fdbk-mask">
						<path id="border" d="M 0 64 h 32 l -32 -32 q 32 0 32 -32 h 144 v 32 l 160 -32 h 144 q 0 32 32 32 v 416 q 0 64 -64 64 h -112 v -32 h -160 v 32 h -112 q -64 0 -64 -64 v -384" stroke="none" fill="white"/>

						<path id="star" d="M 256 112 L 368 416 L 96 224 H 416 L 144 416 L 256 112" stroke="none" fill="black"/>
					</mask>
				</defs>
				<rect x="0" y="0" width="512" height="512" mask="url(#fdbk-mask)"/>
			</svg>
		);
	}
}

export default Logo;
