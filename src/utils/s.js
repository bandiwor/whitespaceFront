function getCountSquares(w_, h_) {
	let w = w_;
	let h = h_;
	let count = 0;

	while (w > 0 || h > 0) {
		++count;
		const squareSide = Math.max(w, h);
		w -= squareSide;
		h -= squareSide;
	}

	return count;
}