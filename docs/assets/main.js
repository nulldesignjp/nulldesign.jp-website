// スクロール連動の演出（日英ページ共通）。
// ルール: アクセス時に画面内にある要素は動かさない。画面外の [data-reveal] だけに
// .is-pending（opacity 0）を付け、IntersectionObserver で画面に入ったら外す。
// JS が動かない・読み込めない場合は何も付かず、全要素が表示されたままになる。
(() => {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries
				.filter((e) => e.isIntersecting)
				.forEach((e, i) => {
					// 同時に入った要素だけ時間差を付ける（最大 5 段階）
					e.target.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
					e.target.classList.remove('is-pending');
					observer.unobserve(e.target);
				});
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0 }
	);

	document.querySelectorAll('[data-reveal]').forEach((el) => {
		// 画面内（またはスクロール位置の復元で既に通り過ぎた位置）の要素は対象外
		if (el.getBoundingClientRect().top < innerHeight) return;
		el.classList.add('is-pending');
		observer.observe(el);
	});
})();
