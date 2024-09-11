import React, { useEffect, useState } from 'react';
import './styles.css';
import { Button, notification, Radio, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DetailExam = () => {
	const { userCurrent } = useAuth();
	const params = useParams();
	const navigate = useNavigate();

	const [api, contextHolder] = notification.useNotification();

	const [isLoading, setIsLoading] = useState(false);
	const [startTimer, setStartTimer] = useState(false);
	const [isActive, setIsActive] = useState(false);
	// phút * giây
	const [time, setTime] = useState(1 * 5);
	const [detailExam, setDetailExam] = useState({});
	const [answerOfUser, setAnswerOfUser] = useState([]);
	const [score, setScore] = useState(0);

	// State quản lý trạng thái
	// false => chưa nộp bài
	// true => đã nộp bài
	const [isSubmited, setSubmited] = useState(false);

	const answerConvert = {
		0: 'A',
		1: 'B',
		2: 'C',
		3: 'D',
	};

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	const handleStartExam = () => {
		setStartTimer(true);
	};

	const convertSlugToId = (slug) => {
		const id = slug.split('-').pop().split('.').shift();

		return id;
	};

	const fetchExam = async (id) => {
		if (!id) {
			navigate('/');
		}
		setIsLoading(true);
		try {
			const response = await fetch(`http://localhost:5000/exams/${id}`);
			const exam = await response.json();

			setTime(exam.time * 60);

			setDetailExam(exam);
			setIsLoading(false);
		} catch (err) {
			navigate('/');
		}
	};

	const handleCalScore = (value, indexQuestion) => {
		const answerOfUserTemp = [...answerOfUser];
		answerOfUserTemp[indexQuestion] = value;

		setAnswerOfUser(answerOfUserTemp);
	};

	const handleSubmitExam = async () => {
		let countAnswerCorrect = 0;
		let highest_point = detailExam.highest_point ?? 0;

		for (let i = 0; i < detailExam.questions.length; i++) {
			if (answerOfUser[i] === detailExam.questions[i].answer_correct) {
				countAnswerCorrect += 1;
			}
		}

		if (countAnswerCorrect > highest_point) {
			// Cập nhật điểm cao nhất
			const detailExamUpdate = {
				...detailExam,
				highest_point: countAnswerCorrect
			}
			try{
				const response = await fetch(`http://localhost:5000/exams/${detailExam.id}`, {
					method: 'PUT',
					body: JSON.stringify(detailExamUpdate),
					headers: {
						'Content-Type': 'application/json',
					},
				});
	
			} catch (e) {

			}
		}

		setSubmited(true);
		setScore(countAnswerCorrect);

		const record = {
			idUser: userCurrent.id,
			idExam: detailExam.id,
			subject: detailExam.subject,
			title: detailExam.title,
			time_progess: detailExam.time * 60 - time,
			score: countAnswerCorrect,
		};

		try {
			const response = await fetch('http://localhost:5000/histories', {
				method: 'POST',
				body: JSON.stringify(record),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			api.success({
				message: 'Nộp thành công',
			});
		} catch (e) {
			api.error({
				message: 'Nộp thất bài',
			});
		}

		// console.log('countAnswerCorrect: ', countAnswerCorrect);
	};

	useEffect(() => {
		const id = convertSlugToId(params.idExam);

		fetchExam(id);
	}, []);

	useEffect(() => {
		let interval = null;
		if (startTimer && !isActive) {
			setIsActive(true);
		}

		if (isActive) {
			interval = setInterval(() => {
				setTime((prevTime) => {
					if (prevTime === 0) {
						clearInterval(interval);
						handleSubmitExam();
						return 0;
					}

					if (isSubmited) {
						clearInterval(interval);
					}
					return prevTime - 1;
				});
			}, 1000);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [isActive, startTimer, isSubmited]);

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (startTimer) {
				const message =
					'Bạn có chắc chắn muốn rời khỏi trang? Thời gian làm bài sẽ bị mất!';
				event.preventDefault(); // Đảm bảo trình duyệt hiển thị cảnh báo
				event.returnValue = message; // Thêm thuộc tính để hiển thị thông báo trên trình duyệt
				return message; // Một số trình duyệt yêu cầu trả về thông báo
			}
		};

		if (startTimer) {
			window.addEventListener('beforeunload', handleBeforeUnload);
		}

		if (time === 0 || isSubmited) {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		}

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [startTimer, time, isSubmited]);


	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);

	const handleAddComment = async () => {
		if (comment.trim()) {
		  const newComment = {
			id: Date.now(), // hoặc dùng uuid để tạo ID duy nhất
			content: comment,
			userId: userCurrent.id,
			examId: detailExam.id,
			timestamp: new Date().toISOString(),
		  };
	  
		  try {
			const response = await fetch('http://localhost:5000/comments', {
			  method: 'POST',
			  body: JSON.stringify(newComment),
			  headers: {
				'Content-Type': 'application/json',
			  },
			});
			const savedComment = await response.json();
			setComments([...comments, savedComment]);
			setComment('');
		  } catch (e) {
			console.error('Failed to add comment:', e);
		  }
		}
	  };
	  const fetchComments = async (examId) => {
		try {
		  const response = await fetch(`http://localhost:5000/comments?examId=${examId}`);
		  const comments = await response.json();
		  setComments(comments);
		} catch (err) {
		  console.error('Failed to fetch comments:', err);
		}
	  };
	  
	  useEffect(() => {
		const id = convertSlugToId(params.idExam);
		fetchExam(id);
		fetchComments(id); // Tải bình luận sau khi tải bài thi
	  }, []);
	  
	return isLoading ? (
		<Spin />
	) : (<div>
		<div className='exam-detail-container'>
			{contextHolder}
			{/* Header */}
			<header className='exam-header'>
				<div className='exam-title'>
					<h1>Tên Đề Thi</h1>
				</div>
				<div className='back-button'>
					<Button onClick={() => navigate(-1)}>Quay lại</Button>
				</div>
			</header>

			{/* Exam Info */}
			<section
				className='exam-info'
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div>
					<h2>Thông Tin Đề Thi</h2>
					<p>
						<strong>Tên đề thi:</strong> {detailExam?.title}
					</p>
					<p>
						<strong>Thời gian làm bài:</strong> {detailExam?.time} phút
					</p>
					<p>
						<strong>Số lượng câu hỏi:</strong> {detailExam?.questions?.length}{' '}
						câu
					</p>
				</div>
				<div style={{ display: !isSubmited && 'none' }}>
					<h2>Số câu trả lời đúng</h2>
					<h1>
						{score}/{detailExam?.questions?.length}
					</h1>
				</div>
			</section>

			{/* Countdown Timer */}

			<div className='countdown-timer'>
				{startTimer ? (
					<h3>Thời gian còn lại: {formatTime(time)}</h3>
				) : (
					<Button type='primary' onClick={handleStartExam}>
						Bắt đầu làm bài
					</Button>
				)}
			</div>

			{/* Questions List */}
			<section className='questions-section'>
				{/* Question */}
				{detailExam.questions?.map((question, index) => (
					<div key={`question-${index + 1}`} className='question-item'>
						<p>
							<strong>Câu {index + 1}:</strong> {question.question} ?
						</p>
						<div className='answer-options' style={{ marginTop: '10px' }}>
							<Radio.Group
								onChange={(event) => handleCalScore(event.target.value, index)}
							>
								<Space direction='vertical' style={{ width: '100%' }}>
									{question?.answers.map((answer, indexAnswer) => (
										<Radio
											value={answerConvert[indexAnswer]}
											// disabled={startTimer ? false : true}
											disabled={!startTimer || isSubmited}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<div
													style={{
														marginRight: '8px',
														width: '78px',
														color:
															question.answer_correct ==
																answerConvert[indexAnswer] && isSubmited
																? 'green'
																: 'black',
													}}
												>
													{answer}
												</div>
											</div>
										</Radio>
									))}
								</Space>
							</Radio.Group>
						</div>
					</div>
				))}
			</section>

			{/* Submit Button */}
			{startTimer && !isSubmited && (
				<footer className='exam-footer'>
					<Button
						type='primary'
						className='submit-button'
						onClick={handleSubmitExam}
					>
						Nộp bài
					</Button>
				</footer>
			)}
		</div>
		<section className='comments-section' style={{ display: startTimer ? 'none' : 'block' }}>
  <h2>Bình luận</h2>
  <div className='comments-list'>
    {comments.map((comment) => (
      <div key={comment.id} className='comment-item'>
        <p><strong>{userCurrent.username}:</strong> {comment.content}</p>
        <p className='comment-timestamp'>{new Date(comment.timestamp).toLocaleString()}</p>
      </div>
    ))}
  </div>
  <div className='add-comment'>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder='Nhập bình luận...'
      rows={3}
    />
    <Button type='primary' onClick={handleAddComment} disabled={startTimer}>
      Gửi
    </Button>
  </div>
</section>
		</div>
	);
};

export default DetailExam;
