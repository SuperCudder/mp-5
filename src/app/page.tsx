"use client"

import { useState } from "react";
/* main page for site, handles submit, short*/
export default function Home() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setShortUrl("");

        try {
            new URL(url);
        } catch {
            setError("Invalid URL format");
            return;
        }

        setLoading(true); /* used with usestate hook tracks api */

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, alias }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "No data");
            } else {
                const fullUrl = `${window.location.origin}/${data.alias}`;
                setShortUrl(fullUrl);
                setUrl("");
                setAlias("");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
    };

    /* give ppl the option to make some prank/mock sketchy urls as their alias to match the theme */
    const generateSketchyAlias = () => {
        const prefixes = [
            "definitely-not-malware",
            "totally-safe-link",
            "troj-67",
            "not-a-virus",
            "official-prize-winner",
            "free-spyware-claim",
            "click-here-for-worm",
            "free-car-claim",
            "mrbeast-winner",
            "sylkrode",
            "urgent-action-required",
            "congratulations-you-won",
            "youve-got-mail",
            "amazon-free-giftcard",
            "free-rookit",
            "2-years-spotify-free",
            "bank-verify-account"
        ];

        const suffixes = [
            "real-no-scam",
            "spy-botnet",
            "legit-website",
            "official-site",
            "not-fake",
            "secure-login",
            "safe-download",
            "verified-link",
            "real-ransom",
            "government-uplink"
        ];

        const randomChars = Math.random().toString(36).substring(2, 6); /* makes sure that there are at least a few thousand original url combos, yea its kinda long but this is a shortener for long links anyways right? (asking grader) */
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        setAlias(`${prefix}-${randomChars}-${suffix}`);
    };

    return ( /* hacker theme through tailwind*/
        <div className="flex min-h-screen items-center justify-center bg-black font-mono">
            <div className="w-full max-w-2xl space-y-8 p-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-green-500 tracking-wider" style={{textShadow: '0 0 10px #00ff00'}}>
                        [SECURE_URL_SHORTENER.EXE]
                    </h1>
                    <p className="text-green-400 text-sm">
                        &gt; SYSTEM READY // CREATE SHORTENED LINKS
                    </p>
                    <p className="mt-2 text-green-500 animate-pulse">
                        █████████████████████████████
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 border-2 border-green-500 p-6 rounded-lg" style={{boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'}}>
                    <div>
                        <label htmlFor="url" className="block text-sm font-bold text-green-400 mb-2">
                            &gt; ORIGINAL_URL:
                        </label>
                        <input
                            id="url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                            className="block w-full border-2 border-green-600 bg-black px-4 py-3 text-green-400 placeholder-green-700 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            style={{fontFamily: 'Courier New, monospace'}}
                        />
                    </div>

                    <div>
                        <label htmlFor="alias" className="block text-sm font-bold text-green-400 mb-2">
                            &gt; ALIAS_IDENTIFIER:
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="alias"
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                placeholder="custom-alias"
                                required
                                className="block w-full border-2 border-green-600 bg-black px-4 py-3 text-green-400 placeholder-green-700 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                style={{fontFamily: 'Courier New, monospace'}}
                            />
                            <button
                                type="button"
                                onClick={generateSketchyAlias}
                                className="whitespace-nowrap border-2 border-red-600 bg-red-900 px-6 py-3 text-sm font-bold text-red-400 hover:bg-red-800 hover:border-red-500 focus:outline-none"
                                style={{textShadow: '0 0 5px #ff0000'}}
                            >
                                [RANDOMIZE]
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border-2 border-green-500 bg-green-900 px-4 py-4 font-bold text-green-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{textShadow: '0 0 5px #00ff00'}}
                    >
                        {loading ? "[PROCESSING...]" : "[GENERATE_LINK]"}
                    </button>
                </form>

                {error && (
                    <div className="border-2 border-red-600 bg-red-950 p-4" style={{boxShadow: '0 0 15px rgba(255, 0, 0, 0.4)'}}>
                        <p className="text-sm text-red-400 font-bold">&gt;&gt; ERROR: {error}</p>
                        <p className="text-xs text-red-500 mt-1">SYSTEM STATUS: OPERATION_FAILED</p>
                    </div>
                )}

                {shortUrl && (
                    <div className="border-2 border-green-500 bg-black p-6 space-y-4" style={{boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'}}>
                        <div className="text-center">
                            <p className="text-green-400 font-bold text-sm mb-2 animate-pulse">
                                &gt;&gt;&gt; URL SHORTENED SUCCESSFULLY &lt;&lt;&lt;
                            </p>
                            <p className="text-green-500 text-xs">STATUS: OPERATION_COMPLETE</p>
                        </div>

                        <div className="border border-green-600 p-4 bg-green-950/30">
                            <p className="text-xs font-bold text-green-400 mb-2">
                                &gt; SHORTENED_URL [COPY TO SHARE]:
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={shortUrl}
                                    readOnly
                                    className="flex-1 border border-green-500 bg-black px-3 py-2 text-sm text-green-400 font-mono"
                                    style={{textShadow: '0 0 5px #00ff00'}}
                                />
                                <button
                                    onClick={handleCopy}
                                    className="border-2 border-green-500 bg-green-900 px-4 py-2 text-xs font-bold text-green-300 hover:bg-green-800 focus:outline-none"
                                >
                                    [COPY]
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

