<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ReportService;

class ReportController extends Controller{
    public function __construct(
        private ReportService $reportService
    ){}

    public function index(Request $request){
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $targetType = $request->query('target_type', 'ALL');
        $status = $request->query('status', 'ALL');
        $searchQuery = $request->query('search', '');
        $result = $this->reportService->getReports(
            $page,
            $perPage,
            $targetType,
            $status,
            $searchQuery
        );
        return response()->json([
            'success' => true,
            'data'=> $result['reports'],
            'pagination'=> $result['pagination'],
        ]);
    }

    public function handleStatus(Request $request){
        $id = $request->input('id', null);
        $status = $request->input('status', null);
        $userId = $request->input('resolved_by', null);
        $result = $this->reportService->handleStatus($id, $status, $userId);
        return response()->json([
            'success' =>$result['success'],
            'data' => $result['report'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $data = $request->all();
        $result = $this->reportService->create($data['auth_user'], $data);
        return $result;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function adminGetCountByDays(int $days){
        $result = $this->reportService->adminGetCountByDays($days);
        return response()->json([
            'data'=>$result,
        ]);
    }

}
