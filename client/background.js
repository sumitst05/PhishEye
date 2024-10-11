function showNotification(title, message) {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: 'icon.png',
		title: title,
		message: message,
		priority: 1
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "sendPrediction") {
		fetch("https://phish-eye.koyeb.app/predict_url", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request.data),
		})
			.then((response) => response.json())
			.then((data) => {
				chrome.storage.local.set({ prediction: data });

				const title = "Phishing Detection Result";
				const message = `Prediction: ${data.Prediction === 1 ? "Phishing URL" : "Safe URL"}, Confidence: ${data.Confidence}`;
				showNotification(title, message);

				sendResponse({ success: true, data });
			})
			.catch((error) => {
				sendResponse({ success: false, error });
			});

		return true;
	}

	if (request.action === "sendEmailPrediction") {
		fetch("https://phish-eye.koyeb.app/predict_email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request.data),
		})
			.then((response) => response.json())
			.then((data) => {
				chrome.storage.local.set({ prediction: data });

				const title = "Phishing Detection Result";
				const message = `Prediction: ${data.Prediction}, Confidence: ${data.Confidence}`;
				showNotification(title, message);

				sendResponse({ success: true, data });
			})
			.catch((error) => {
				sendResponse({ success: false, error });
			});

		return true;
	}
});
