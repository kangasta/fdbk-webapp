import React, { Component } from 'react';

import './style/Logo.css';

class Logo extends Component {
	render() {
		return (
			<svg className="Logo" viewBox="0 0 512 512">
				<path id="border" d="M 0 64 h 32 l -32 -32 q 32 0 32 -32 h 144 v 32 l 160 -32 h 144 q 0 32 32 32 v 416 q 0 64 -64 64 h -112 v -32 h -160 v 32 h -112 q -64 0 -64 -64 v -384 M 256 112 L 297 224 H 416 L 327 304 L 368 416 L 256 336 L 144 416 L 185 304 L 96 224 H 215 L 256 112" fillRule='evenodd'/>
			</svg>
		);
	}
}

export default Logo;
