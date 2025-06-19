export const defaultTreeData = {
	"name": "Feature:Trunk control",
	"children": [
		{
			"name": "Requirement#8733",
			"children": [
				{              /*  */
					"name": "User story#34356",
					"children": [
						{
							"name": "SWC:TrkDoorCtrl",
							"children": [
								{ "name": "Commit#122131" },
								{ "name": "Commit#21233d" },
								{ "name": "Commit#2322131" },
								{ "name": "Commit#622131" },
								{
									"name": "Commit#7722131",
									"children": [
										{
											"name": "CB#122131",
											"children": [
												{
													"name": "CI#892131",
													"children": [
														{
															"name": "Trunk test bench#1.6.7",
															"children": [
																{
																	"name": "Cosimulation Job#5523",
																	"children": [
																		{ "name": "Pipeline ID677523" },
																		{
																			"name": "Pipeline ID977523",
																			"children": [
																				{
																					"name": "Test case#435", "status": 'Failed', 'itemStyle': {
																						color: 'red',
																					}
																				},
																				{
																					"name": "Test case#535", "status": 'Passed', 'itemStyle': {
																						color: 'green'

																					}
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{ "name": "User story#89356" }
			]
		}
	]
}

export const makeTreeData = (data = []) => {
	let returnData = {
		"name": "Feature:Trunk control",
		"link": null,
		"tooltip": 'Jira User Story - BMSVECO-45',
		'itemStyle': { color: '#0052CC' },
		"children": [
			{
				"name": "Requirement #8733",
				"tooltip": 'Jira User Story - BMSVECO-45',
				"link": null,
				'itemStyle': { color: '#0052CC' },
				"children": [
					{
						"name": "User Story - BMSVECO-45",
						"tooltip": 'Jira User Story - BMSVECO-45',
						"link": "https://jira-muc.kpit.com/projects/BMSVECO/issues/BMSVECO-41",
						'itemStyle': { color: '#0052CC' },
						"children": [
							{
								"name": "SWC:TrkDoorCtrl",
								'itemStyle': { color: '#F08000' },
								"tooltip": 'Multi-ECU-Testbench' ,
								"link": "https://gitlab2.kpit.com/experience-kineto/ces-2025/multi-ecu/multi-ecu-pass-testbench/-/tree/feature-kineto-BMSVECO-45",
								"children": data && Array.isArray(data) ?
								 data?.map((commits) => {
									const vteDatastr = commits?.vte_data;
									const vteData = JSON.parse(vteDatastr);
									return {
										"name": "Commit: " + commits?.git_commit_id?.substring(0, 8),
										"tooltip": 'GitLab Repo Commit #',
										'itemStyle': { color: '#F08000' },
										"link": commits?.git_commit_link,
										"children": [
											{
												"name": "Pipeline: " + commits?.pipeline_id,
												'itemStyle': { color: '#F08000' },
												"tooltip": 'GitLab Repo CI/CD Pipeline',
												"link": null,
												"children": [
													{
														"name": vteData?.package_name,
														"tooltip": 'Test Bench on Kineto VTE',
														'itemStyle': { color: '#b0ff45' },
														"link": "https://vte.kineto.kpit.com",
														"children": [
															{
																"name": `Cosimulation Job #${vteData?.cosimulation_id}`,
																"tooltip": 'Cosim Job on Kineto VTE',
																'itemStyle': { color: '#b0ff45' },
																"link": "https://vte.kineto.kpit.com/cosimulation",
																"children": vteData?.cosimulation_data?.map((pipeline) => {
																	return {
																		"name": "Cosimulation PipeLine: " + pipeline?.pipeline_id,
																		"tooltip": 'Cosim Pipeline on Kineto VTE',
																		"link": null,
																		'itemStyle': { color: pipeline?.pipeline_status === 'PASS' ? 'green' : 'red' },
																		'children': pipeline?.test_suites?.map((testsuite) => {
																			return {
																				"name": (testsuite?.test_suite_name || testsuite?.test_suite_id),
																				"link": null,
																				"tooltip": `Test Suite: ${testsuite?.test_suite_status === 'PASS' ? 'Passed' : 'Failed'} `,
																				'itemStyle': { color: testsuite?.test_suite_status === 'PASS' ? 'green' : 'red' },
																				'children': testsuite?.test_cases?.map((testcase) => {
																					return {
																						"name": testcase?.testcase_name,
																						"tooltip": `Test Case: ${testcase?.testcase_status === 'PASS' ? 'Passed' : 'Failed'} `,
																						"link": null,
																						'itemStyle': { color: testcase?.testcase_status === 'PASS' ? 'green' : 'red' },
																						'children': []
																					}
																				})
																			}
																		})
																	}
																})
															}
														]
													}
												]
											}
										]
									}
								}) : []
							}
						]
					},
				]
			}
		]
	}

	return returnData;
}