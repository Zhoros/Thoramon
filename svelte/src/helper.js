export function uuid() {
	return new Date().getTime() + "-" + Array.from({length: 7}, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")
}

export function post(path, dataObject, callback, error){

	fetch(path, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dataObject)
	})
	.then(response => {
		if (!response.ok) {
			return "error";
		}
		if(response.headers.get("Content-Type").includes("application/json")){
			return response.json()
		}else{
			return response.text()
		}
	})
	.then((data) => { 
		callback(data);
	}).catch((err) => {
		if (error) error(err)
	})

}

export function getCurrentDateTime(now) {

	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	return `${year}-${month}-${day}T${hours}:${minutes}`

}

export function formatDateTime(time) {
    const date = new Date(time);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
