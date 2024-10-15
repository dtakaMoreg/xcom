javascript:(async () => {
    const viewportDiv = document.querySelector('div[data-viewportview="true"]');

    if (!viewportDiv) {
        console.log('data-viewportview="true"のdivが見つかりません。');
        return;
    }

    const links = new Set(); // 重複を避けるためにSetを使用

    const scrollAndCollectLinks = async () => {
        return new Promise((resolve) => {
            let distance = 100; // スクロールする距離
            let timer = setInterval(() => {
                let scrollTop = viewportDiv.scrollTop; // 現在のスクロール位置
                let scrollHeight = viewportDiv.scrollHeight; // 全体のスクロール可能な高さ
                let clientHeight = viewportDiv.clientHeight; // 見えている範囲の高さ

                // 現在表示されているリンクを取得
                viewportDiv.querySelectorAll('a').forEach(a => {
                    const href = a.href;
                    if (!href.includes('src=hashtag_click')) {
                        links.add(href); // 重複を避けるためにSetに追加
                    }
                });

                // スクロール位置を更新
                viewportDiv.scrollBy(0, distance);

                // 最下部に近づいた場合は終了（余裕を持たせる）
                if (scrollTop + clientHeight + 1 >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500); // 500msごとにスクロール
        });
    };

    // スクロールしながらリンクを収集
    await scrollAndCollectLinks();

    // リンクを改行で区切ったテキストとして準備
    const linkText = Array.from(links).join('\n');

    // テキストファイルをダウンロードする関数
    const download = (filename, text) => {
        const element = document.createElement('a');
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // リンクのテキストファイルをダウンロード
    download('viewport_links_without_hashtag.txt', linkText);
})();
