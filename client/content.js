// Function to change page background color
function changePageColor(color) {
	document.body.style.backgroundColor = color;
}

document.addEventListener("click", function(event) {
	const target = event.target;

	if (target.tagName === "A") {
		const url = target.href;

		const urlFeatures = {
			length_url: url.length,
			length_hostname: new URL(url).hostname.length,
			nb_dots: (url.match(/\./g) || []).length,
			nb_qm: (url.match(/\?/g) || []).length,
			nb_eq: (url.match(/=/g) || []).length,
			nb_slash: (url.match(/\//g) || []).length,
			nb_www: url.includes("www.") ? 1 : 0,
			ratio_digits_url: (url.match(/\d/g) || []).length / url.length,
			ratio_digits_host: (new URL(url).hostname.match(/\d/g) || []).length / new URL(url).hostname.length,
			tld_in_subdomain: new URL(url).hostname.split('.').slice(-2)[0] === 'com' ? 1 : 0,
			shortest_word_host: Math.min(...new URL(url).hostname.split('.').map(word => word.length)),
			longest_words_raw: Math.max(...url.split('/').map(segment => segment.length)),
			longest_word_path: Math.max(...new URL(url).pathname.split('/').map(segment => segment.length)),
			nb_hyperlinks: document.getElementsByTagName("a").length,
			ratio_intHyperlinks: document.getElementsByTagName("a").length / document.body.innerText.split(' ').length,
			empty_title: document.title ? 0 : 1,
			domain_in_title: document.title.includes(new URL(url).hostname) ? 1 : 0
		};

		chrome.runtime.sendMessage({ action: "sendPrediction", data: urlFeatures }, function(response) {
			if (response.success) {
				console.log("URL Prediction response:", response.data);

				if (response.data.Prediction === 1) {
					changePageColor("red");  // Phishing URL
				} else if (response.data.Prediction === 0) {
					changePageColor("green");  // Safe URL
				}
			} else {
				console.error("Error:", response.error);
			}
		});
	}
});

// Observer to detect when an email is opened
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.target.matches(".ii.gt")) {
			const emailContent = mutation.target.innerText;
			chrome.runtime.sendMessage({
				action: "sendEmailPrediction",
				data: { email_text: emailContent }
			}, function(response) {
				if (response.success) {
					console.log("Email Prediction response:", response.data);

					if (response.data.Prediction === "Phishing Email") {
						changePageColor("red");  // Phishing Email
					} else if (response.data.Prediction === "Safe Email") {
						changePageColor("green");  // Safe Email
					}
				} else {
					console.error("Error:", response.error);
				}
			});
		}
	});
});

observer.observe(document.body, { childList: true, subtree: true });
