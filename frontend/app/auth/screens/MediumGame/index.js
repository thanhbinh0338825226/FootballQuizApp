import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Thêm icon đồng hồ từ FontAwesome
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { API_URL } from "../../../../config";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { setMusicVolume } from "../../utils/AudioController";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function MediumGame() {
  const navigation = useNavigation();
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(180); // 180 seconds = 3 minutes
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [answered, setAnswered] = useState(false); // Để kiểm tra khi người dùng đã trả lời câu hỏi
  const scoreRef = useRef(score);
  const timeoutRef = useRef(null);
  const [usedCallFriendHelp, setUsedCallFriendHelp] = useState(false);
  const [reducedAnswers, setReducedAnswers] = useState(null);
  const [usedFiftyFiftyHelp, setUsedFiftyFiftyHelp] = useState(false); // đã sử dụng 50 50 ở câu hỏi hiện tại chưa
  const [usedFiftyFiftyHelpGlobal, setUsedFiftyFiftyHelpGlobal] =
    useState(false); // 	Đã sử dụng 50/50 chưa (toàn game, chỉ dùng 1 lần)

  const [usedAudienceHelp, setUsedAudienceHelp] = useState(false);
  const [audienceChartData, setAudienceChartData] = useState([]); // chứa dữ liệu vote
  const [isAudienceModalVisible, setIsAudienceModalVisible] = useState(false);

  // Ẩn header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    fetchQuestion(); // ← gọi API ban đầu khi vào màn hình
  }, []);
  useEffect(() => {
    // Khi người dùng vào màn hình trò chơi, giảm âm lượng nhạc xuống 20%
    setMusicVolume(0.2);

    return () => {
      // Khi người dùng rời màn hình trò chơi, phục hồi âm lượng về 100%
      setMusicVolume(1.0);
    };
  }, []);

  useEffect(() => {
    scoreRef.current = score; // Cập nhật scoreRef mỗi lần score thay đổi
  }, [score]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setGameOver(true);
      Alert.alert("⏱️ Hết giờ!", "Trò chơi đã kết thúc!");
      const elapsedTime = 180 - timer;
      router.push({
        pathname: "/auth/screens/GameOverScreen",
        params: {
          score: scoreRef.current.toString(),
          elapsedTime: elapsedTime.toString(),
          level: "medium",
        },
      });
    }, 180000);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleCallFriendHelp = async () => {
    if (usedCallFriendHelp) {
      Alert.alert(
        "⚠️ Đã dùng",
        "Bạn chỉ được sử dụng quyền trợ giúp này một lần."
      );
      return;
    }

    try {
      const allAnswers = question.options.map((opt) => opt.name);
      const res = await fetch(`${API_URL}/api/call-friend-help`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.questionId,
          allAnswers: allAnswers,
        }),
      });

      const result = await res.json();
      const reply = result.reply || "Không có phản hồi từ bạn bè.";

      // Tắt nhạc trước khi đọc giọng nói
      setMusicVolume(0.0);

      // Đọc bằng giọng nói
      Speech.speak(reply, {
        language: "vi-VN",
        rate: 1.0,
        onDone: () => {
          // Bật lại nhạc sau khi đọc xong
          setMusicVolume(0.2);

          // Hiển thị alert sau khi đọc xong
          Alert.alert("Câu trả lời từ người thân là:", reply);
        },
      });

      setUsedCallFriendHelp(true);
    } catch (error) {
      console.error("Lỗi khi gọi trợ giúp gọi điện:", error);
      Alert.alert("Lỗi", "Không thể gọi trợ giúp.");
    }
  };

  const handleFiftyFiftyHelp = async () => {
    if (usedFiftyFiftyHelp || usedFiftyFiftyHelpGlobal) {
      Alert.alert("⚠️ Đã dùng", "Bạn chỉ được dùng 50/50 một lần.");
      return;
    }

    try {
      const allAnswers = question.options.map((opt) => opt.name);

      const res = await fetch(`${API_URL}/api/fifty-fifty-help`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.questionId,
          allAnswers: allAnswers,
        }),
      });

      const result = await res.json();
      if (!result.answers || result.answers.length !== 2) {
        throw new Error("Kết quả không hợp lệ từ API.");
      }

      setReducedAnswers(result.answers); // Cập nhật đáp án đã rút gọn
      setUsedFiftyFiftyHelp(true); // Đánh dấu đã dùng 50/50
      setUsedFiftyFiftyHelpGlobal(true);
    } catch (err) {
      console.error("Lỗi khi gọi trợ giúp 50/50:", err);
      Alert.alert("Lỗi", "Không thể sử dụng trợ giúp 50/50.");
    }
  };

  const handleAudienceHelp = async () => {
    if (usedAudienceHelp) {
      Alert.alert(
        "⚠️ Đã dùng",
        "Bạn chỉ được sử dụng trợ giúp khán giả một lần."
      );
      return;
    }

    try {
      const allAnswers = question.options.map((opt) => opt.name);
      const res = await fetch(`${API_URL}/api/audience-help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.questionId,
          allAnswers: allAnswers,
        }),
      });

      const result = await res.json();

      if (!result.percentages) throw new Error("Không có dữ liệu audience.");

      const data = Object.entries(result.percentages).map(([label, value]) => ({
        option: label,
        vote: value,
      }));
      setAudienceChartData(data);
      setUsedAudienceHelp(true);
      setIsAudienceModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi gọi audience help:", error);
      Alert.alert("Lỗi", "Không thể sử dụng trợ giúp khán giả.");
    }
  };

  const shortenLabel = (label) => {
    if (label.length <= 10) return label; // nếu ngắn thì giữ nguyên

    const parts = label.split(" ");
    if (parts.length === 1) {
      // Nếu là 1 từ mà vẫn quá dài thì cắt đôi từ đó
      const mid = Math.ceil(label.length / 2);
      return label.slice(0, mid) + "\n" + label.slice(mid);
    }

    // Nếu có nhiều từ → viết tắt từ đầu tiên, và xuống dòng cho phần còn lại
    return parts.map((p, i) => (i === 0 ? p.charAt(0) + "." : p)).join("\n");
  };

  const fetchQuestion = async () => {
    if (usedQuestionIds.length >= 10) {
      clearTimeout(timeoutRef.current);
      setGameOver(true);
      Alert.alert("🎉 Hoàn thành!", "Bạn đã trả lời đủ 10 câu hỏi.");
      const elapsedTime = 180 - timer;
      router.push({
        pathname: "/auth/screens/GameOverScreen",
        params: {
          score: scoreRef.current.toString(),
          elapsedTime: elapsedTime.toString(),
          level: "medium",
        },
      });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/Question/quiz/random`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty: "Medium",
          usedQuestionIds: usedQuestionIds, // truyền mảng các câu hỏi đã dùng
        }),
      });
      const responseText = await res.text();

      if (responseText.startsWith("<")) {
        throw new Error("API trả về trang lỗi HTML thay vì JSON");
      }

      // Nếu phản hồi là JSON hợp lệ, phân tích JSON
      const data = JSON.parse(responseText);

      if (data?.error === "Không đủ cầu thủ để tạo đáp án") {
        Alert.alert(
          "Lỗi hệ thống",
          "Hệ thống đang bị lỗi, vui lòng quay trở lại sau.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
              style: "default",
            },
          ]
        );
        return;
      }

      // Lưu ID câu hỏi đã dùng để tránh lặp
      setUsedQuestionIds((prev) => [...prev, data.questionId]);
      setQuestion(data);
    } catch (err) {
      console.error("Lỗi khi lấy câu hỏi:", err);
    }
  };

  useEffect(() => {
    if (timer <= 0 || gameOver) return; // Nếu game over thì không giảm thời gian nữa

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameOver]);

  const handleAnswer = async (selectedAnswer) => {
    if (gameOver || answered) return; // Nếu game đã kết thúc, không làm gì cả

    try {
      const res = await fetch(`${API_URL}/Question/checkAnswer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.questionId,
          selectedAnswer: selectedAnswer,
        }),
      });

      const result = await res.json();
      if (result.message === "Trả lời đúng!") {
        setScore((prev) => prev + 1);
        Alert.alert("✅ Chính xác!", "Bạn đã trả lời đúng.");
      } else {
        setGameOver(true); // Khi trả lời sai, kết thúc game
        clearTimeout(timeoutRef.current);
        Alert.alert("❌ Sai rồi!", "Bạn đã trả lời sai. Trò chơi kết thúc.");
        const elapsedTime = 180 - timer;
        router.push({
          pathname: "/auth/screens/GameOverScreen",
          params: {
            score: score.toString(),
            elapsedTime: elapsedTime.toString(),
            level: "medium",
          },
        });
      }
      setAnswered(true);
    } catch (err) {
      console.error("Lỗi khi kiểm tra đáp án:", err);
      Alert.alert("Lỗi", "Không thể kiểm tra đáp án.");
    }
  };

  const loadNextQuestion = async () => {
    if (gameOver) return; // Nếu game over thì không tải câu hỏi mới

    try {
      // Gọi fetchQuestion để lấy câu hỏi mới
      await fetchQuestion(); // Nếu fetchQuestion đã được sửa đúng cách, nó sẽ xử lý việc cập nhật câu hỏi
      setAnswered(false); // Không cần phải gọi thêm fetch ở đây nữa
      setReducedAnswers(null); // ✅ reset lại 50/50 mỗi câu
      setUsedFiftyFiftyHelp(false);
      setAudienceChartData(null);
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi mới:", err);
      Alert.alert(
        "Không thể tải câu hỏi",
        "Có lỗi xảy ra khi tải câu hỏi mới. Vui lòng thử lại sau."
      );
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <LinearGradient
      colors={["#ADD8E6", "#FFE4B5", "#98FB98"]} // Ba màu nền
      style={styles.container}
    >
      {question ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.inlineHelpButton}
              onPress={handleCallFriendHelp}
            >
              <MaterialIcons name="contact-phone" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inlineHelpButton}
              onPress={handleFiftyFiftyHelp}
            >
              <MaterialIcons name="filter-2" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inlineHelpButton}
              onPress={handleAudienceHelp}
            >
              <MaterialIcons name="groups" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Câu hỏi</Text>

          <View style={styles.timerContainer}>
            <FontAwesome name="clock-o" size={24} color="#ff6347" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
          <Text style={styles.scoreText}>Điểm: {score}</Text>
          {question.imageUrl && (
            <Image source={{ uri: question.imageUrl }} style={styles.image} />
          )}

          <Text style={styles.questionText}>
            {question.type || "Ai là cầu thủ trong ảnh?"}
          </Text>

          {question.options?.map((opt, index) => {
            const isReduced =
              usedFiftyFiftyHelp && !reducedAnswers?.includes(opt.name);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isReduced && { backgroundColor: "#d3d3d3" }, // làm mờ nền nếu bị loại
                ]}
                onPress={() => handleAnswer(opt.name)}
                disabled={answered || isReduced}
              >
                <Text
                  style={[styles.optionText, isReduced && { color: "#d3d3d3" }]}
                >
                  {isReduced ? "" : opt.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          <Modal
            visible={isAudienceModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  padding: 20,
                  width: "90%",
                }}
              >
                {/* Nút đóng */}
                <TouchableOpacity
                  onPress={() => setIsAudienceModalVisible(false)}
                  style={{ position: "absolute", right: 10, top: 10 }}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Khán giả chọn:
                </Text>
                {audienceChartData && audienceChartData.length > 0 && (
                  <BarChart
                    data={{
                      // labels: audienceChartData.map(item => item.option),
                      labels: audienceChartData.map((item) =>
                        shortenLabel(item.option)
                      ),
                      datasets: [
                        { data: audienceChartData.map((item) => item.vote) },
                      ],
                    }}
                    width={Dimensions.get("window").width * 0.8}
                    height={220}
                    fromZero={true}
                    yAxisSuffix="%"
                    chartConfig={{
                      backgroundColor: "#e26a00",
                      backgroundGradientFrom: "#fb8c00",
                      backgroundGradientTo: "#ffa726",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      propsForLabels: {
                        fontSize: 8, // nếu không có tác dụng thì bỏ qua
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: "",
                      },
                    }}
                    style={{ borderRadius: 16 }}
                  />
                )}
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={loadNextQuestion}
            disabled={!answered}
          >
            <Text style={styles.nextButtonText}>Kế tiếp</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#888888",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
    color: "black",
    textAlign: "center",
    fontFamily: "bold",
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#ff6347", // Màu đỏ cam
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%", // Căn giữa các nút
  },
  optionText: {
    fontSize: 18,
    color: "#fff",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6347",
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  nextButton: {
    padding: 15,
    backgroundColor: "#4CAF50", // Màu xanh lá
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  inlineHelpButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 30,
    marginRight: 10,
  },
});
