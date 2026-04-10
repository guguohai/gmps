# Inventory Module Field Audit (Final Source of Truth)

Based on `implementation_plan.md.resolved.7`, the following are the exact fields required for each module's detail page to be considered complete.

## 1. Delivery Invoice (出库单) - 19 Fields
1. 出库单编号 (Readonly)
2. 业务来源类型 (Select)
3. 来源单号
4. 出库类型 (Select)
5. 产品编码
6. 产品名称 (Readonly)
7. 规格/型号 (Readonly)
8. 出库数量
9. 单位 (Select)
10. 出库仓位 (Select)
11. 接收方类型 (Select)
12. 接收方
13. 配送方式 (Select)
14. 物物流单号
15. 状态 (Select)
16. 出库时间
17. 执行人
18. 执行说明 (Textarea)
19. 备注 (Textarea)

## 2. Transfer (调拨单) - 17 Fields
1. 调拨单编号 (Readonly)
2. 调拨类型 (Select)
3. 业务来源类型 (Select)
4. 来源单号
5. 调出仓库/位置
6. 调入仓库/位置
7. 产品编码
8. 产品名称 (Readonly)
9. 调拨数量
10. 单位 (Select)
11. 申请时间
12. 状态 (Select)
13. 处理人
14. 完成时间
15. 调拨原因 (Textarea)
16. 处理说明 (Textarea)
17. 备注 (Textarea)

## 3. Discrepancy (差异处理) - 19 Fields
1. 差异单编号 (Readonly)
2. 差异类型 (Select)
3. 差异来源 (Select)
4. 来源单号
5. 产品编码
6. 产品名称 (Readonly)
7. 仓库/位置
8. 账面数量
9. 实际数量
10. 差异数量 (Readonly)
11. 处理方式 (Select)
12. 修正数量
13. 状态 (Select)
14. 发现时间
15. 处理时间
16. 处理人
17. 差异原因 (Textarea)
18. 处理说明 (Textarea)
19. 备注 (Textarea)

## 4. Sync Log (同步日志) - 18 Fields
1. 同步批次号 (Readonly)
2. 同步对象 (Select)
3. 同步类型 (Select)
4. 触发方式 (Select)
5. 开始时间
6. 结束时间
7. 状态 (Select)
8. 成功数量
9. 失败数量
10. 差异数量
11. 来源系统
12. 目标系统
13. 执行任务名称
14. 执行人
15. 异常摘要 (Textarea)
16. 失败明细 (Table/Textarea)
17. 处理结果 (Textarea)
18. 备注 (Textarea)
