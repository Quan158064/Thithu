import React, { useEffect, useState } from 'react';
import { Card, Divider, List, Avatar } from 'antd';
import { ClockCircleOutlined, QuestionCircleOutlined, StarOutlined, StockOutlined } from '@ant-design/icons';

const Ranking = () => {
    const [listExam, setListExam] = useState([]);

    const getListExam = async () => {
        const response = await fetch('http://localhost:5000/timesTaken');
        const exams = await response.json();
        // Sắp xếp theo số lần thi giảm dần
        const sortedExams = exams.sort((a, b) => b.timesTaken - a.timesTaken);
        setListExam(sortedExams);
    };

    useEffect(() => {
        getListExam();
    }, []);

    return (
        <Card style={{ marginTop: '32px' }}>
            <Divider orientation='left' style={{ margin: '0px' }}>
                Bảng xếp hạng đề thi
            </Divider>
            <List
                className='ranking-list'
                itemLayout='horizontal'
                dataSource={listExam}
                renderItem={(exam, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{ height: '50px', width: '50px' }}>
                                    {exam.subject.charAt(0).toUpperCase()}
                                </Avatar>
                            }
                            title={`${index + 1}. ${exam.title}`}
                            description={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <QuestionCircleOutlined />
                                        <span style={{ marginLeft: '4px' }}>{exam.numQuestions} câu</span>
                                    </div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <ClockCircleOutlined />
                                        <span style={{ marginLeft: '4px' }}>{exam.duration} phút</span>
                                    </div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <StarOutlined />
                                        <span style={{ marginLeft: '4px' }}>Điểm cao nhất: {exam.maxScore}</span>
                                    </div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <StockOutlined />
                                        <span style={{ marginLeft: '4px' }}>Mức độ: {exam.level}</span>
                                    </div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <span>Số lần thi: {exam.timesTaken}</span>
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default Ranking;
