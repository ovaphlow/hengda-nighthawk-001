import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import reducer from '../utils/reducer';

const Editbar = React.lazy(() => import('../components/Editbar'));



const initial_filter = {
  dpet: '',
  route: '',
  date1: dayjs().format('YYYY-MM-01'),
  date2: dayjs().format('YYYY-MM-DD'),
};

export default function Filter() {

  const [list, setList] = useState([]);

  const [dept, setDept] = React.useState([])

  const [route, setRoute] = React.useState([])

  const [filter, dispatch] = React.useReducer(reducer, initial_filter);

  useEffect(() => {

    setDept([
      { id: 1, name: 'dept1' },
      { id: 2, name: 'dept2' },
      { id: 3, name: 'dept3' },
    ])

    setRoute([
      { id: 1, name: 'route1' },
      { id: 2, name: 'route2' },
      { id: 3, name: 'route3' },
    ])

    window
      .fetch(`/api/nighthawk-001/?`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        setList(data);
      });
  }, [])



  return (
    <div className="container-fluid">
      <Editbar />

      <div className="container">
        <div className="row mb-2">
          <div className="col">
            <label className="form-label">车次</label>
            <select className="form-select"
              value={filter.route}
              onChange={(event) =>
                dispatch({
                  type: 'route',
                  payload: event.target.value,
                })
              }
            >
              <option value="">未选择</option>
              {route && route.map((item) =>
                <option key={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div className="col">
            <label className="form-label">车间</label>
            <select className="form-select"
              value={filter.dept}
              onChange={(event) => {
                dispatch({
                  type: 'dept',
                  payload: event.target.value,
                })
              }}
            >
              <option value="">未选择</option>
              {dept && dept.map((item) =>
                <option key={item.id}>{item.name}</option>)}
            </select>
          </div>
          <div className="col">
            <label className="form-label">开始时间</label>
            <input type="date" className="form-select"
              value={filter.date1}
              onChange={(event) =>
                dispatch({
                  type: 'date1',
                  payload: event.target.value,
                })
              } />
          </div>
          <div className="col">
            <label className="form-label">开始结束</label>
            <input type="date" className="form-select"
              value={filter.date2}
              onChange={(event) =>
                dispatch({
                  type: 'date2',
                  payload: event.target.value,
                })
              } />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col d-flex justify-content-center">
            <button className="btn btn-outline-primary mx-2">
              查询
            </button>
            <button className="btn btn-outline-success mx-2">
              导出
            </button>
          </div>
        </div>

        <div className="card shadow rounded-0">
          <div className="table-responsive">
            <table className="table table-sm table-bordered table-hover">
              <thead>
                <tr>
                  <th>基础信息</th>
                  <th>(供电/断电)记录</th>
                </tr>
              </thead>
              <tbody>
                {list && list.map(item => (
                  <tr key={item.id}>
                    <td className="p-0">
                      <table className="table table-bordered table-sm mb-0">
                        <tbody>
                          <tr>
                            <td colSpan="2">序号</td>
                            <td colSpan="2" scope="row">
                              <a href={`#/${item.id}`}>
                                <FontAwesomeIcon icon={faEdit} fixedWidth />
                              编辑
                            </a> &nbsp;
                            {item.id}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2">日期</td>
                            <td colSpan="2">
                              {dayjs(item.datime).format('YYYY-MM-DD')}
                            </td>
                          </tr>
                          <tr>
                            <td>车间</td>
                            <td>{item.dept.name}</td>
                            <td>作业班组</td>
                            <td>{item.team}</td>
                          </tr>
                          <tr>
                            <td>车次</td>
                            <td>{item.route}</td>
                            <td>整备线股道</td>
                            <td>{item.rail}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="p-0">
                      <table className="table table-bordered table-sm mb-0">
                        <tbody>
                          <tr>
                            <td rowSpan="2">供电记录</td>
                            <td>申请人</td>
                            <td>领取供电钥匙</td>
                            <td>申请供电(操作员)</td>
                            <td>申请时间</td>
                            <td>供电方式</td>
                            <td>值班员</td>
                          </tr>
                          <tr>
                            <td>{item.gongdian.staff1}</td>
                            <td>{item.gongdian.staff2}</td>
                            <td>{item.gongdian.staff3}</td>
                            <td>{item.gongdian.datime}</td>
                            <td>{item.gongdian.category}</td>
                            <td>{item.gongdian.staff4}</td>
                          </tr>
                          <tr>
                            <td rowSpan="2">断电记录</td>
                            <td>申请人</td>
                            <td colSpan="2">领取供电钥匙/申请断电(监护员)</td>
                            <td>申请时间</td>
                            <td>返回钥匙</td>
                            <td>值班员</td>
                          </tr>
                          <tr>
                            <td>{item.duandian.staff1}</td>
                            <td colSpan="2">{item.duandian.staff2}</td>
                            <td>{item.duandian.datime}</td>
                            <td>{item.duandian.staff3}</td>
                            <td>{item.duandian.staff4}</td>
                          </tr>
                        </tbody>

                      </table>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}