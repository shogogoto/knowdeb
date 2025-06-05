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
        "単文を繋ぐネットワーク構造によって接続詞の冗長さを排除し、知識を簡潔に表現します。",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "スコアリング",
      description:
        "繋がりのカウントによって単文の重要度を数値化し、重要度を可視化、検索可能にします。",
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
              知識管理プラットフォーム
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/search"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                検索してみよう！
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </a>
              <a
                href="/register"
                className="px-8 py-4 border border-gray-400 rounded-xl text-lg font-medium hover:bg-white/10 transition-all duration-200"
              >
                新規登録してみよう！
              </a>
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

      {/* Problem Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            文章を理解するのって大変！
          </h2>
          <div className="bg-white/5 p-8 rounded-2xl border border-gray-600">
            <ul className="space-y-4 text-xl text-gray-300 text-left">
              <li>• 重要な内容はどこ？</li>
              <li>• この内容がどこに繋がるの？現在地が分からない</li>
              <li>• これを理解するのにどこまで勉強すればいいの？</li>
            </ul>
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
              <div className="p-6 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-xl">
                <h3 className="text-xl font-semibold mb-2 text-purple-400">
                  単文主義
                </h3>
                <p className="text-gray-300">
                  長文の複雑さを排除し、一つの文で一つの概念を表現。理解コストを最小化します。
                </p>
              </div>

              <div className="p-6 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">
                  グラフ構造
                </h3>
                <p className="text-gray-300">
                  単文を繋ぐネットワーク構造によって接続詞の冗長さを排除し、知識を簡潔に表現。
                </p>
              </div>

              <div className="p-6 bg-green-500/10 border-l-4 border-green-500 rounded-r-xl">
                <h3 className="text-xl font-semibold mb-2 text-green-400">
                  スコアリング
                </h3>
                <p className="text-gray-300">
                  繋がりのカウントによって単文の重要度を数値化し、重要度を可視化、検索可能。
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <Network className="w-24 h-24 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a
              href="/docs/concept"
              className="text-purple-400 hover:underline text-lg flex items-center justify-center"
            >
              より詳細なコンセプトの説明はこちら
              <ChevronRight className="inline-block ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* SNS Integration Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            単文主義 × SNS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-gray-600 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-purple-300">
                効率的なディスカッション
              </h3>
              <p className="text-gray-300">
                ピンポイントな単文引用による、誤解の少ない効率的な議論が可能です。
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-gray-600 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-300">
                再利用コラボレーション
              </h3>
              <p className="text-gray-300">
                他のメモの単文を簡単にインポートし、知識の再利用と共同作業を促進します。
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-gray-600 hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-green-300">
                深い繋がり
              </h3>
              <p className="text-gray-300">
                興味を細部まで表現することで、本当に共感できる人と深く繋がれます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Adjusted */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            知識の新しい時代を
            <br />
            一緒に始めませんか？
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            単文主義で構造化された知識管理の革命に参加して、
            <br />
            より効率的で明確な思考を手に入れましょう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/search"
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-lg font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              検索してみよう！
            </a>
            <a
              href="/register"
              className="px-10 py-4 border border-gray-400 rounded-xl text-lg font-medium hover:bg-white/10 transition-all duration-200"
            >
              新規登録してみよう！
            </a>
          </div>

          {/* Additional Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a
              href="/docs/getting-started"
              className="text-gray-400 hover:underline flex items-center"
            >
              始め方について
              <ChevronRight className="inline-block ml-2 w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:underline flex items-center"
            >
              問い合わせはこちら
              <Mail className="inline-block ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-700">
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
