require "test_helper"

class Api::V1::InventoryBatchesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_v1_inventory_batch = api_v1_inventory_batches(:one)
  end

  test "should get index" do
    get api_v1_inventory_batches_url, as: :json
    assert_response :success
  end

  test "should create api_v1_inventory_batch" do
    assert_difference("Api::V1::InventoryBatch.count") do
      post api_v1_inventory_batches_url, params: { api_v1_inventory_batch: {} }, as: :json
    end

    assert_response :created
  end

  test "should show api_v1_inventory_batch" do
    get api_v1_inventory_batch_url(@api_v1_inventory_batch), as: :json
    assert_response :success
  end

  test "should update api_v1_inventory_batch" do
    patch api_v1_inventory_batch_url(@api_v1_inventory_batch), params: { api_v1_inventory_batch: {} }, as: :json
    assert_response :success
  end

  test "should destroy api_v1_inventory_batch" do
    assert_difference("Api::V1::InventoryBatch.count", -1) do
      delete api_v1_inventory_batch_url(@api_v1_inventory_batch), as: :json
    end

    assert_response :no_content
  end
end
