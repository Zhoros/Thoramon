export function uuid(): string {
	return new Date().getTime() + "-" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
