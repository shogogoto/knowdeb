import {
  BookOpen,
  ChevronRight,
  Mail,
  Network,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const KnowdeLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "単文主義",
      description:
        "長文の複雑さを排除し、一つの文で一つの概念を表現。理解コストを最小化します。",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "グラフ構造",
      description:
        "文と文の関係性を可視化。接続詞の冗長さを構造化によって排除します。",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "スコアリング",
      description:
        "関係カウントによる単文の評価値。理解コストや重要度を可視化します。",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "高度な検索",
      description:
        "スコアリング、距離指定、リソース指定による精密な単文検索機能。",
    },
  ];

  const roadmapItems = [
    {
      level: "LV1",
      title: "自分が使える",
      description: "メモ評価・単文検索でメモ帳を超える使い勝手",
      status: "開発中",
      color: "bg-blue-500",
    },
    {
      level: "LV2",
      title: "他人に見せられる",
      description: "考えやメモを伝達する手段として活用",
      status: "計画中",
      color: "bg-purple-500",
    },
    {
      level: "LV3",
      title: "ユーザー機能",
      description: "他人も使えるサービス運用開始",
      status: "計画中",
      color: "bg-green-500",
    },
    {
      level: "LV4",
      title: "SNS機能",
      description: "単文の追跡性を活かしたSNS",
      status: "計画中",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center relative">
          <div
            className="transform transition-transform duration-700"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              knowde
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              単文主義で知識を構造化する
              <br />
              新しい時代の知識管理プラットフォーム
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                今すぐ始める
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </button>
              <button
                type="button"
                className="px-8 py-4 border border-gray-400 rounded-xl text-lg font-medium hover:bg-white/10 transition-all duration-200"
              >
                デモを見る
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            なぜ<span className="text-purple-400">knowde</span>なのか？
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "bg-white/20 border-purple-400 scale-105"
                    : "bg-white/5 border-gray-600 hover:bg-white/10"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            <span className="text-purple-400">単文主義</span>の革命
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl">
                <h3 className="text-xl font-semibold mb-2 text-red-400">
                  従来の問題点
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 長文は全体を読まないと理解できない</li>
                  <li>• 重要なポイントが分からない</li>
                  <li>• 理解コストが不透明</li>
                </ul>
              </div>

              <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-r-xl">
                <h3 className="text-xl font-semibold mb-2 text-green-400">
                  knowdeの解決策
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 一文一概念で明確性を確保</li>
                  <li>• グラフ構造で関係性を可視化</li>
                  <li>• スコアリングで重要度を定量化</li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <Network className="w-24 h-24 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            開発ロードマップ
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((item) => (
              <div
                key={item.title}
                className="relative p-6 bg-white/5 backdrop-blur-sm border border-gray-600 rounded-2xl hover:bg-white/10 transition-all duration-300"
              >
                <div
                  className={`inline-block px-3 py-1 ${item.color} rounded-full text-xs font-medium mb-4`}
                >
                  {item.level}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                <div className="text-xs text-gray-400">{item.status}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">目標納期: 2025年12月31日</p>
            <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-1/4" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            知識の新しい時代を
            <br />
            一緒に始めませんか？
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            単文主義で構造化された知識管理の革命に参加して、
            より効率的で明確な思考を手に入れましょう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              type="button"
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              早期アクセスに登録
            </button>
            <button
              type="button"
              className="px-10 py-4 border border-gray-400 rounded-xl text-lg font-medium hover:bg-white/10 transition-all duration-200"
            >
              詳細資料をダウンロード
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <button
              type="button"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <img
                alt="GitHub"
                height="32"
                width="32"
                src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/github.svg"
              />
            </button>
            <button
              type="button"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <img
                alt="GitHub"
                height="32"
                width="32"
                src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/x.svg"
              />
            </button>
            <button
              type="button"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <Mail className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 border-t border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">knowde</h3>
          <p className="text-gray-400 mb-6">
            単文主義で知識を構造化する新しい時代の知識管理プラットフォーム
          </p>
          <div className="text-sm text-gray-500">
            © 2025 knowde. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KnowdeLanding;
