export async function copyToClipboard(text: string): Promise<boolean> {
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (_error) {}
	}

	const ta = Object.assign(document.createElement('textarea'), {
		value: text,
		style: 'position:fixed;top:0;left:0;opacity:0;pointer-events:none',
	});
	document.body.appendChild(ta);
	try {
		ta.select();
		return document.execCommand('copy');
	} finally {
		ta.remove();
	}
}

export function createCopyStatus(setStatus: (message: string | null) => void, resetMs = 2000) {
	let timer: ReturnType<typeof setTimeout> | null = null;

	function set(message: string) {
		setStatus(message);
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			setStatus(null);
			timer = null;
		}, resetMs);
	}

	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	return { set, clear };
}
