import React, { useState, useEffect } from 'react';
import { Volume2, Star, Trophy, Mic, RotateCcw } from 'lucide-react';

const EnglishSpeakingGame = () => {
  const [currentScene, setCurrentScene] = useState('menu');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const categories = {
    animals: {
      name: '動物たち',
      emoji: '🐾',
      color: 'bg-green-400',
      questions: [
        {
          question: 'What sound does a cat make?',
          japanese: '猫はどんな鳴き声？',
          answer: 'meow',
          alternatives: ['mew', 'meow meow'],
          image: '🐱',
        },
        {
          question: 'What sound does a dog make?',
          japanese: '犬はどんな鳴き声？',
          answer: 'woof',
          alternatives: ['bow wow', 'woof woof', 'bark'],
          image: '🐶',
        },
        {
          question: 'What color is an elephant?',
          japanese: '象は何色？',
          answer: 'gray',
          alternatives: ['grey'],
          image: '🐘',
        },
        {
          question: 'Where do birds live?',
          japanese: '鳥はどこに住んでいる？',
          answer: 'tree',
          alternatives: ['trees', 'nest', 'sky'],
          image: '🐦',
        },
      ],
    },
    food: {
      name: '食べもの',
      emoji: '🍎',
      color: 'bg-red-400',
      questions: [
        {
          question: 'What color is an apple?',
          japanese: 'りんごは何色？',
          answer: 'red',
          alternatives: ['green', 'yellow'],
          image: '🍎',
        },
        {
          question: "What do you drink when you're thirsty?",
          japanese: 'のどが渇いたら何を飲む？',
          answer: 'water',
          alternatives: ['juice', 'milk'],
          image: '💧',
        },
        {
          question: 'What do bees make?',
          japanese: 'ハチは何を作る？',
          answer: 'honey',
          alternatives: [],
          image: '🍯',
        },
        {
          question: "What's yellow and long?",
          japanese: '黄色くて長いものは？',
          answer: 'banana',
          alternatives: [],
          image: '🍌',
        },
      ],
    },
    colors: {
      name: '色',
      emoji: '🌈',
      color: 'bg-purple-400',
      questions: [
        {
          question: 'What color is the sun?',
          japanese: '太陽は何色？',
          answer: 'yellow',
          alternatives: ['orange'],
          image: '☀️',
        },
        {
          question: 'What color is grass?',
          japanese: '草は何色？',
          answer: 'green',
          alternatives: [],
          image: '🌱',
        },
        {
          question: 'What color is the sky?',
          japanese: '空は何色？',
          answer: 'blue',
          alternatives: [],
          image: '☁️',
        },
        {
          question: 'What color is snow?',
          japanese: '雪は何色？',
          answer: 'white',
          alternatives: [],
          image: '❄️',
        },
      ],
    },
  };

  const playSound = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setFeedback(
        'ごめんね！このブラウザは音声認識に対応していないよ。でも答えを見ることはできるよ！'
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setFeedback('英語で答えてね！聞いているよ...');

    recognition.onresult = (event) => {
      const userAnswer = event.results[0][0].transcript.toLowerCase().trim();
      checkAnswer(userAnswer);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback('うまく聞こえなかったよ。もう一度試してみて！');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const checkAnswer = (userAnswer) => {
    const currentQ = categories[selectedCategory].questions[currentQuestion];
    const correctAnswers = [currentQ.answer, ...currentQ.alternatives];

    const isCorrect = correctAnswers.some(
      (answer) =>
        userAnswer.includes(answer.toLowerCase()) ||
        answer.toLowerCase().includes(userAnswer)
    );

    if (isCorrect) {
      setScore(score + 10);
      setFeedback(`すごい！正解だよ！ "${userAnswer}" って言えたね！⭐`);
      playSound('Great job!');
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      setFeedback(
        `惜しい！もう一度挑戦してみよう。正解は "${currentQ.answer}" だよ。`
      );
      playSound(currentQ.answer);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < categories[selectedCategory].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFeedback('');
      setShowAnswer(false);
    } else {
      setCurrentScene('result');
    }
  };

  const resetGame = () => {
    setCurrentScene('menu');
    setScore(0);
    setCurrentQuestion(0);
    setSelectedCategory(null);
    setFeedback('');
    setShowAnswer(false);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentScene('game');
    setCurrentQuestion(0);
    setScore(0);
    setFeedback('');
    setShowAnswer(false);
  };

  if (currentScene === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 animate-bounce">
              🎤 英語でおしゃべりゲーム 🎤
            </h1>
            <p className="text-xl text-white">
              英語で答えて、スターを集めよう！
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => selectCategory(key)}
                className={`${category.color} hover:scale-105 transform transition-all duration-200 rounded-xl p-6 text-white font-bold text-xl shadow-lg hover:shadow-xl`}
              >
                <div className="text-4xl mb-4">{category.emoji}</div>
                <div>{category.name}</div>
                <div className="text-sm mt-2 opacity-90">
                  {category.questions.length}問
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8 text-white">
            <p className="text-lg mb-2">🎯 遊び方</p>
            <p className="text-sm opacity-90">
              カテゴリーを選んで、英語で質問に答えよう！
              <br />
              マイクボタンを押して話すか、答えを見ることもできるよ。
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentScene === 'game') {
    const currentQ = categories[selectedCategory].questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={resetGame}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw size={16} />
              メニューに戻る
            </button>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-300" size={20} />
                <span className="font-bold">{score}</span>
              </div>
              <div className="text-sm">
                {currentQuestion + 1} /{' '}
                {categories[selectedCategory].questions.length}
              </div>
            </div>
          </div>

          {/* 質問カード */}
          <div className="bg-white rounded-xl p-8 shadow-xl mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentQ.image}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentQ.question}
              </h2>
              <p className="text-gray-600">{currentQ.japanese}</p>
            </div>

            {/* 音声読み上げボタン */}
            <div className="text-center mb-6">
              <button
                onClick={() => playSound(currentQ.question)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Volume2 size={20} />
                質問を聞く
              </button>
            </div>

            {/* 回答ボタン */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={startListening}
                disabled={isListening}
                className={`${
                  isListening ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'
                } text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold`}
              >
                <Mic size={20} />
                {isListening ? '聞いているよ...' : '英語で答える'}
              </button>

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
              >
                {showAnswer ? '答えを隠す' : '答えを見る'}
              </button>
            </div>

            {/* 答え表示 */}
            {showAnswer && (
              <div className="text-center bg-yellow-100 p-4 rounded-lg mb-4">
                <p className="text-lg font-bold text-gray-800">
                  答え: <span className="text-blue-600">{currentQ.answer}</span>
                </p>
                {currentQ.alternatives.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    他の答え: {currentQ.alternatives.join(', ')}
                  </p>
                )}
                <button
                  onClick={() => playSound(currentQ.answer)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 mx-auto"
                >
                  <Volume2 size={16} />
                  発音を聞く
                </button>
              </div>
            )}

            {/* フィードバック */}
            {feedback && (
              <div className="text-center bg-blue-100 p-4 rounded-lg mb-4">
                <p className="text-gray-800">{feedback}</p>
              </div>
            )}

            {/* 次の問題ボタン */}
            {showAnswer && (
              <div className="text-center">
                <button
                  onClick={nextQuestion}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold"
                >
                  次の問題へ →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScene === 'result') {
    const totalQuestions = categories[selectedCategory].questions.length;
    const maxScore = totalQuestions * 10;
    const percentage = (score / maxScore) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-md">
          <Trophy className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            おつかれさま！
          </h2>
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🏅'}
          </div>
          <p className="text-xl text-gray-700 mb-4">
            スコア: <span className="font-bold text-blue-600">{score}</span> /{' '}
            {maxScore}
          </p>
          <p className="text-gray-600 mb-6">
            {percentage >= 80
              ? 'すばらしい！'
              : percentage >= 60
              ? 'よくできました！'
              : 'がんばったね！もう一度挑戦してみよう！'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setCurrentScene('game');
                setFeedback('');
                setShowAnswer(false);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              もう一度
            </button>
            <button
              onClick={resetGame}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg"
            >
              メニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default EnglishSpeakingGame;
