module.exports = {
    // 滑动页面到底部，因为很多网页做了懒加载
    scrollPage() {
        return new Promise((resolve) => {
            +function loop() {
                window.scrollTo(0, Number.MAX_SAFE_INTEGER);
                setTimeout(() => {
                    if (isEnd()) {
                        resolve();
                    } else {
                        loop();
                    }
                }, 2000);
            }()
        })
        function isEnd() {
            const height = document.documentElement.scrollHeight
            if (!isEnd.height || isEnd.height !== height) {
                isEnd.height = document.documentElement.scrollHeight
                return false;
            } else {
                return true;
            }
        }
    },
    toArray(nodeList) {
        return Array.prototype.slice.call(nodeList)
    },
    selectEls(selector) {
        return this.toArray(document.querySelectorAll(selector))
    }
}